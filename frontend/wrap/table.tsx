/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Button,
  DataGrid,
  DataGridCellEditableRenderer,
  DataGridCellSwitch,
  DataGridCellTag,
  DataGridCellTooltip,
  FormItem,
  InputField,
  Radio,
  RadioGroup,
  SearchArea,
  useMessageBar,
} from "@amxis/design-system";
import {
  ControlConfirmIcon,
  ControlResetIcon,
} from "@amxis/design-system/icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  CellClickedEvent,
  CellEditingStoppedEvent,
  ColDef,
  EditableCallbackParams,
  ICellRendererParams,
  IRowNode,
  IsRowSelectable,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { CommonCodeGroup } from "models/admin/CommonCode";
import { CommonYN } from "models/common/Common";
import { CrudCode } from "models/common/Edit";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMessageManagementStore } from "stores/useMessageManagementStore";
import { z } from "zod";

import { getCommonCodes } from "@/apis/admin/CommonCode";
import { ButtonGroup, Spacer } from "@/components/layout";
import { useLoading } from "@/components/loader";
import { MessageModal } from "@/components/modals/common/MessageModal";
import {
  IMessageCellRendererParams,
  MessageCellRenderer,
} from "@/components/ui/grid/renderer";
import { useCommonCodeGroupsMutation } from "@/hooks/queries/common/use-common-code-groups-mutation";
import { useCommonCodeGroupsQuery } from "@/hooks/queries/common/use-common-code-groups-query";
import { useCommonDialogStore } from "@/stores/useCommonDialogStore";
import useLanguageStore from "@/stores/useLanguageStore";

// ──────────────────────────────────────────────
// CodeGroupGrid (인라인)
// ──────────────────────────────────────────────

interface CodeGroupGridProps {
  sGrCd?: string;
  sUseYn?: string;
  sCode?: string;
  editable: boolean;
  callBack?: any;
}

const CodeGroupGrid = (props: CodeGroupGridProps) => {
  const gridRef = useRef<AgGridReact<CommonCodeGroup>>(null);
  const [rowData, setRowData] = useState<CommonCodeGroup[]>([]);
  const isEditingRef = useRef(false);
  const tempIdCounterRef = useRef(0);
  const { openCommonDialog } = useCommonDialogStore();
  const { t } = useTranslation();
  const { findMessagesWithLastSearchedCondition } = useMessageManagementStore();
  const { currentLanguage } = useLanguageStore();
  const { showMessageBar } = useMessageBar();
  const { openLoading } = useLoading();
  const queryClient = useQueryClient();
  const { data: fetchedCommonCodeGroups, refetch } = useCommonCodeGroupsQuery({
    cmnGrCd: props.sGrCd || "",
    cmnCd: props.sCode || "",
    useYn: props.sUseYn ?? "",
  });
  const { mutateAsync: saveCommonCodeGroups } = useCommonCodeGroupsMutation();

  const defaultColDef: ColDef = {
    resizable: true,
    sortable: false,
  };

  const columnDefs: ColDef[] = [
    {
      colId: "checkColumn",
      width: 28,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerClass: "checkbox",
      showDisabledCheckboxes: true,
      cellStyle: { textAlign: "center" },
      hide: !props.editable,
      editable: false,
    },
    {
      headerName: String(t("role-user.column.상태", "상태")),
      colId: "crudKey",
      field: "crudKey",
      width: 60,
      editable: false,
      cellStyle: { textAlign: "center" },
      cellRenderer: function (params: ICellRendererParams) {
        if (params.data.crudKey === CrudCode.DELETE) {
          return (
            <DataGridCellTag appearance="boxing" colorType="error">
              {t("common.label.삭제", "삭제")}
            </DataGridCellTag>
          );
        } else if (params.data.crudKey === CrudCode.UPDATE) {
          return (
            <DataGridCellTag appearance="boxing" colorType="warning-minor">
              {t("common.label.변경", "변경")}
            </DataGridCellTag>
          );
        } else if (params.data.crudKey === CrudCode.CREATE) {
          return (
            <DataGridCellTag appearance="boxing" colorType="confirmed">
              {t("common.label.추가", "추가")}
            </DataGridCellTag>
          );
        } else {
          return;
        }
      },
    },
    {
      headerName: String(t("code.column.그룹코드", "그룹코드")),
      colId: "cmnGrCd",
      field: "cmnGrCd",
      width: 150,
      editable: (params: EditableCallbackParams) => {
        return params.node!.data.crudKey === CrudCode.CREATE;
      },
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <DataGridCellEditableRenderer
            {...params}
            isEditable={params.node!.data.crudKey === CrudCode.CREATE}
          />
        );
      },
      headerComponentParams: {
        required: true,
      },
    },
    {
      headerName: String(t("code.column.그룹코드명", "그룹코드명")),
      field: "cmnGrCdNm",
      width: 150,
      editable: true,
      cellRenderer: (params: ICellRendererParams) => {
        return <DataGridCellEditableRenderer {...params} isEditable={true} />;
      },
      headerComponentParams: {
        required: true,
      },
    },
    {
      headerName: String(t("code.column.설명", "설명")),
      colId: "cmnGrCdDesc",
      field: "cmnGrCdDesc",
      minWidth: 300,
      flex: 1,
      editable: true,
      tooltipComponent: DataGridCellTooltip,
      tooltipField: "cmnGrCdDesc",
      valueGetter: (params) => params.data?.cmnGrCdDesc ?? "",
    },
    {
      headerName: String(t("code.column.메시지코드", "메시지코드")),
      colId: "msgCtn",
      field: "msgCtn",
      width: 170,
      editable: false,
      cellRenderer: MessageCellRenderer,
      cellRendererParams: (params: ICellRendererParams) => {
        return {
          ...params,
          showButton: () => {
            return params.data["crudKey"] !== CrudCode.CREATE;
          },
          onSubmit: () => {
            if (params.data["crudKey"] !== CrudCode.CREATE) {
              params.node.setDataValue("crudKey", CrudCode.UPDATE);
            }
            findMessagesWithLastSearchedCondition();
          },
        } as IMessageCellRendererParams;
      },
    },
    {
      headerName: String(t("code.column.사용여부", "사용여부")),
      colId: "useYn",
      field: "useYn",
      width: 75,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              const newUseYn =
                params.data.useYn === "N" ? CommonYN.Y : CommonYN.N;
              params.data.useYn = newUseYn;
              if (params.data.crudKey !== CrudCode.CREATE) {
                params.data.crudKey = CrudCode.UPDATE;
              }
              params.api.redrawRows({ rowNodes: [params.node] });
            }}
          >
            <DataGridCellSwitch checked={params.data.useYn == CommonYN.Y} />
          </div>
        );
      },
    },
    {
      headerName: String(t("code.column.정렬순서", "정렬순서")),
      colId: "sortOrd",
      field: "sortOrd",
      valueParser: (params) => Number(params.newValue) || "",
      width: 90,
      editable: true,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <DataGridCellEditableRenderer
            isCenter
            sx={{ overflow: "visible" }}
            {...params}
          />
        );
      },
    },
    {
      headerName: String(t("code.column.옵션1", "옵션1")),
      colId: "optValNm1",
      field: "optValNm1",
      width: 100,
      editable: true,
    },
    {
      headerName: String(t("code.column.옵션2", "옵션2")),
      colId: "optValNm2",
      field: "optValNm2",
      width: 100,
      editable: true,
    },
    {
      headerName: String(t("code.column.옵션3", "옵션3")),
      colId: "optValNm3",
      field: "optValNm3",
      width: 100,
      editable: true,
    },
    {
      headerName: String(t("code.column.옵션4", "옵션4")),
      colId: "optValNm4",
      field: "optValNm4",
      width: 100,
      editable: true,
    },
    {
      headerName: String(t("code.column.옵션5", "옵션5")),
      colId: "optValNm5",
      field: "optValNm5",
      width: 100,
      editable: true,
    },
    {
      headerName: t("api.column.최종수정자", "최종수정자") ?? "최종수정자",
      colId: "dataUpdUserName",
      field: "dataUpdUserName",
      width: 120,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: t("api.column.최종수정일시", "최종수정일시") ?? "",
      colId: "dataUpdDtm",
      field: "dataUpdDtm",
      width: 200,
      cellStyle: { textAlign: "center" },
    },
  ];

  const btnAddRow = useCallback(() => {
    tempIdCounterRef.current += 1;
    const tempId = `__temp_${Date.now()}_${tempIdCounterRef.current}`;
    const newRow = {
      crudKey: CrudCode.CREATE,
      useYn: CommonYN.Y,
      _tempId: tempId,
    } as CommonCodeGroup & { _tempId?: string };

    isEditingRef.current = true;
    setRowData((prevData) => [newRow, ...prevData]);
    props.callBack && props.callBack("");
  }, [props]);

  const btnDelRow = useCallback(async () => {
    const selectedRowNodes = gridRef.current!.api.getSelectedNodes();
    const selectedIds = selectedRowNodes.map((rowNode) => rowNode.id);

    if (selectedIds.length == 0) {
      openCommonDialog({
        modalType: "alert",
        content: t(
          "common.alert.선택된 행이 없습니다.",
          "선택된 행이 없습니다.",
        ),
      });
      return false;
    }

    const existingRows = selectedRowNodes
      .filter((node) => node.data && node.data.crudKey !== CrudCode.CREATE)
      .map((node) => node.data!);

    if (existingRows.length > 0) {
      openLoading(true);
      try {
        const codesWithDetails: string[] = [];
        for (const row of existingRows) {
          if (!row) continue;
          const details = await getCommonCodes(row.cmnGrCd);
          if (details && details.length > 0) {
            codesWithDetails.push(row.cmnGrCd);
          }
        }
        if (codesWithDetails.length > 0) {
          openCommonDialog({
            modalType: "alert",
            content: t(
              "code.alert.하위 코드가 있는 그룹코드는 삭제할 수 없습니다",
              `하위 코드가 있는 그룹코드는 삭제할 수 없습니다.\n[${codesWithDetails.join(", ")}]`,
            ),
          });
          return false;
        }
      } finally {
        openLoading(false);
      }
    }

    openCommonDialog({
      modalType: "confirm",
      content: t(
        "common.confirm.선택된 행을 삭제하시겠습니까?",
        "선택된 행을 삭제하시겠습니까?",
      ),
      onSubmit: async () => {
        gridRef.current!.api.clearFocusedCell();
        isEditingRef.current = true;
        setRowData((prevData) => {
          return prevData
            .filter((row) => {
              const rowId = (row as any)._tempId || row.cmnGrCd;
              if (
                selectedIds.includes(rowId) &&
                row.crudKey === CrudCode.CREATE
              ) {
                return false;
              }
              return true;
            })
            .map((row) => {
              const rowId = (row as any)._tempId || row.cmnGrCd;
              if (
                selectedIds.includes(rowId) &&
                row.crudKey !== CrudCode.CREATE
              ) {
                return { ...row, crudKey: CrudCode.DELETE };
              }
              return row;
            });
        });
        props.callBack && props.callBack("");
      },
    });
  }, [gridRef, openCommonDialog, t, props, openLoading]);

  const btnRefresh = () => {
    const selectedRowNodes = gridRef.current!.api.getSelectedNodes();
    const saveRows = rowData
      .map((rowNode) => (rowNode.crudKey ? rowNode : null))
      .filter((element) => element !== null) as CommonCodeGroup[];

    if (saveRows?.length == 0 && selectedRowNodes.length == 0) {
      openCommonDialog({
        modalType: "alert",
        content: t(
          "common.alert.선택된 메뉴가 없습니다.",
          "선택된 메뉴가 없습니다.",
        ),
      });
      return false;
    }

    if (saveRows?.length == 0) {
      openCommonDialog({
        modalType: "alert",
        content: t(
          "common.alert.변경된 내용이 없습니다.",
          "변경된 내용이 없습니다.",
        ),
      });
      return false;
    }

    openCommonDialog({
      modalType: "confirm",
      content: t(
        "common.confirm.초기화하시겠습니까?",
        "초기화하시겠습니까?(입력하신 정보는 복구가 불가능합니다.)",
      ),
      onSubmit: async () => {
        isEditingRef.current = false;
        const result = await refetch();
        if (result.data) {
          setRowData(result.data);
        }
        if (!result) {
          showMessageBar({
            message: t(
              "common.confirm.초기화에 실패하였습니다.",
              "초기화에 실패하였습니다.",
            ),
            usecase: "error",
          });
        } else {
          showMessageBar({
            message: t("common.confirm.초기화되었습니다", "초기화되었습니다."),
            usecase: "success",
          });
          result.data && setRowData(result.data);
        }
      },
      onClose: () => {
        return false;
      },
    });
  };

  const btnSave = async () => {
    try {
      gridRef.current?.api.stopEditing();
      openLoading(true);

      const gridData: CommonCodeGroup[] = [];
      gridRef.current?.api.forEachNode((node) => {
        if (node.data) {
          const row = node.data;
          if (!row.crudKey) {
            const original = fetchedCommonCodeGroups?.find(
              (item) => item.cmnGrCd === row.cmnGrCd,
            );
            if (original) {
              const normalizeValue = (val: any) =>
                val === null || val === undefined || val === ""
                  ? ""
                  : String(val);
              const isChanged =
                normalizeValue(original.cmnGrCdDesc) !==
                  normalizeValue(row.cmnGrCdDesc) ||
                normalizeValue(original.msgCtn) !==
                  normalizeValue(row.msgCtn) ||
                normalizeValue(original.useYn) !== normalizeValue(row.useYn) ||
                normalizeValue(original.sortOrd) !==
                  normalizeValue(row.sortOrd) ||
                normalizeValue(original.optValNm1) !==
                  normalizeValue(row.optValNm1) ||
                normalizeValue(original.optValNm2) !==
                  normalizeValue(row.optValNm2) ||
                normalizeValue(original.optValNm3) !==
                  normalizeValue(row.optValNm3) ||
                normalizeValue(original.optValNm4) !==
                  normalizeValue(row.optValNm4) ||
                normalizeValue(original.optValNm5) !==
                  normalizeValue(row.optValNm5);
              if (isChanged) {
                row.crudKey = CrudCode.UPDATE;
              }
            }
          }
          gridData.push(row);
        }
      });

      const valid = gridData
        .map((rowNode) => {
          if (rowNode.crudKey && rowNode.crudKey !== CrudCode.DELETE) {
            const cmnGrCdTrimmed = rowNode.cmnGrCd?.trim();
            const cmnGrCdNmTrimmed = rowNode.cmnGrCdNm?.trim();
            if (!cmnGrCdTrimmed) {
              return `${t(
                "common.confirm.그룹코드는 필수 입력입니다.",
                "그룹코드는 필수 입력입니다.",
              )}\n`;
            }
            if (!cmnGrCdNmTrimmed) {
              return `${t("code.label.그룹코드", "그룹코드")} ${cmnGrCdTrimmed}: ${t(
                "common.confirm.그룹코드명은 필수 입력입니다.",
                "그룹코드명은 필수 입력입니다.",
              )}\n`;
            }
            if (rowNode.sortOrd == null || rowNode.sortOrd == "")
              rowNode.sortOrd = "1";
          }
        })
        .filter((element) => element !== undefined);

      if (valid?.length) {
        openCommonDialog({ content: valid.join("") });
        return false;
      }

      let isOnlyDeleted = false;
      const saveRows = gridData
        .map((rowNode) => {
          const isDeleteKey = rowNode.crudKey === "D";
          const isCmnGrCdValid = fetchedCommonCodeGroups?.filter(
            (fetchedData) => fetchedData.cmnGrCd === rowNode.cmnGrCd,
          ).length;
          if (rowNode.crudKey) {
            if (isDeleteKey && isCmnGrCdValid === 0) {
              isOnlyDeleted = true;
              return null;
            }
            return rowNode;
          }
          return null;
        })
        .filter((element) => element !== null) as CommonCodeGroup[];

      if (saveRows?.length == 0) {
        !isOnlyDeleted &&
          openCommonDialog({
            content: t(
              "common.alert.변경된 내용이 없습니다.",
              "변경된 내용이 없습니다.",
            ),
            modalType: "alert",
          });
        fetchedCommonCodeGroups && setRowData(fetchedCommonCodeGroups);
        return true;
      }

      let isDup = false;
      saveRows.some((rowNode) => {
        if (
          gridData.filter((item) => item.cmnGrCd === rowNode.cmnGrCd).length > 1
        ) {
          isDup = true;
        }
      });

      if (isDup) {
        openCommonDialog({
          content: t(
            "common.confirm.중복된 그룹코드가 있습니다.",
            "중복된 그룹코드가 있습니다.",
          ),
          modalType: "alert",
        });
        return false;
      }

      for (let i = 0; i < saveRows.length; i++) {
        saveRows[i].sortOrd = saveRows[i].sortOrd.replace(/,/g, "");
      }

      const response = await saveCommonCodeGroups(saveRows);
      if (!response) {
        showMessageBar({
          message: t(
            "common.alert.저장을 실패했습니다. 잠시 후 다시 시도해주세요.",
            "저장을 실패했습니다. 잠시 후 다시 시도해주세요.",
          ),
          usecase: "error",
        });
        return false;
      }

      showMessageBar({
        message: t("common.alert.저장되었습니다.", "저장되었습니다."),
        usecase: "success",
      });
      props.callBack("");
      isEditingRef.current = false;
      queryClient.invalidateQueries({
        queryKey: [
          "common",
          "commonCodeGroups",
          { cmnGrCd: props.sGrCd, cmnCd: props.sCode, useYn: props.sUseYn },
        ],
      });
    } catch (e: any) {
      showMessageBar({
        message: t(
          "common.alert.저장을 실패했습니다. 잠시 후 다시 시도해주세요.",
          "저장을 실패했습니다. 잠시 후 다시 시도해주세요.",
        ),
        usecase: "error",
      });
      return false;
    } finally {
      openLoading(false);
    }
  };

  const onCellClicked = (event: CellClickedEvent) => {
    props.callBack && props.callBack(event.data.cmnGrCd);
  };

  const onCellEditingStopped = useCallback(
    (event: CellEditingStoppedEvent) => {
      const { data, oldValue, newValue, column, valueChanged } = event;
      const colId = column.getColId();

      if (!valueChanged) return;
      if (colId === "crudKey") return;

      if (colId === "cmnGrCd") {
        data.msgCtn = `com.code.${newValue}`;
      }

      if (colId === "sortOrd") {
        const isValid =
          /^\d+$/.test(newValue) &&
          Number(newValue) > 0 &&
          Number(newValue) < 10001;
        if (!isValid) {
          openCommonDialog({
            modalType: "alert",
            content: t(
              "common.alert.정렬순서에 1 이상 10,000 이하의 숫자만을 입력하세요.",
              "정렬순서에 1 이상 10,000이하의 숫자만을 입력하세요.",
            ),
          });
          setRowData((prevData) =>
            prevData.map((row) => {
              const rowId = (row as any)._tempId || row.cmnGrCd;
              const dataId = (data as any)._tempId || data.cmnGrCd;
              return rowId === dataId
                ? { ...row, [colId]: oldValue || "" }
                : row;
            }),
          );
          return;
        }
      }

      isEditingRef.current = true;
      if (data.crudKey !== CrudCode.CREATE) {
        data.crudKey = CrudCode.UPDATE;
      }

      setRowData((prevData) =>
        prevData.map((row) => {
          const rowId = (row as any)._tempId || row.cmnGrCd;
          const dataId = (data as any)._tempId || data.cmnGrCd;
          return rowId === dataId ? { ...data } : row;
        }),
      );

      props.callBack && props.callBack("");
    },
    [props, t, openCommonDialog],
  );

  useEffect(() => {
    if (!fetchedCommonCodeGroups) return;
    if (isEditingRef.current) return;
    setRowData(fetchedCommonCodeGroups);
  }, [fetchedCommonCodeGroups]);

  const isRowSelectable = useMemo<IsRowSelectable>(() => {
    return (node: IRowNode) => !!node.data;
  }, []);

  return (
    <>
      <DataGrid
        minGridHeight={"calc(50vh - 180px)"}
        getRowId={(params) =>
          (params.data as any)._tempId ||
          params.data.cmnGrCd ||
          `temp-${Date.now()}-${Math.random()}`
        }
        gridRef={gridRef}
        rowHeight={25}
        rowData={rowData}
        title={t("code.label.그룹코드목록", "그룹코드목록") ?? ""}
        infoText={
          t(
            "code.label.삭제된 행은 저장 버튼 클릭 시 반영됩니다",
            "삭제된 행은 저장 버튼 클릭 시 반영됩니다",
          ) ?? ""
        }
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={false}
        suppressRowClickSelection={true}
        stopEditingWhenCellsLoseFocus={true}
        isRowSelectable={isRowSelectable}
        singleClickEdit={true}
        rowSelection="multiple"
        reactiveCustomComponents={false}
        suppressScrollOnNewData={true}
        headerButton={
          props.editable
            ? [
                {
                  variant: "add",
                  label: `${t("common.label.행추가", "행추가")}`,
                  onClick: btnAddRow,
                },
                {
                  variant: "delete",
                  label: `${t("common.label.행삭제", "행삭제")}`,
                  onClick: btnDelRow,
                },
              ]
            : []
        }
        onCellClicked={onCellClicked}
        onCellEditingStopped={onCellEditingStopped}
        emptyLabel={
          t(
            "common.label.조회 가능한 데이터가 없습니다.",
            "__조회 가능한 데이터가 없습니다.",
          ) ?? ""
        }
        language={currentLanguage}
      />
      <Spacer type="h" size="4" />
      <ButtonGroup>
        <Button
          appearance="outlined"
          priority="normal"
          size="medium"
          iconPosition="leading"
          iconComponent={<ControlResetIcon size="small" />}
          onClick={btnRefresh}
          buttonLabel={t("common.button.초기화", "초기화")}
        />
        <Button
          appearance="contained"
          priority="primary"
          size="medium"
          iconPosition="leading"
          iconComponent={<ControlConfirmIcon size="small" />}
          onClick={btnSave}
          buttonLabel={t("common.button.저장", "저장")}
        />
      </ButtonGroup>
    </>
  );
};

// ──────────────────────────────────────────────
// CodePage
// ──────────────────────────────────────────────

function CodePage() {
  const { t } = useTranslation();

  const searchDataSchema = z.object({
    cmnGrCd: z.string().optional(),
    cmnCd: z.string().optional(),
    useYn: z.string().optional(),
  });

  type SearchData = z.infer<typeof searchDataSchema>;

  const { handleSubmit, control } = useForm<SearchData>({
    resolver: zodResolver(searchDataSchema),
    defaultValues: {
      cmnGrCd: "",
      cmnCd: "",
      useYn: "",
    },
  });

  const [filterChipUseYn, setFilterChipUseYn] = useState<string>("");
  const [searchGrCd, setSearchGrCd] = useState<string>("");
  const [searchCode, setSearchCode] = useState<string>("");
  const [searchUseYn, setSearchUseYn] = useState<string>("");
  const { openLoading } = useLoading();
  const { showMessageBar } = useMessageBar();

  const onSubmit = handleSubmit(async ({ cmnGrCd, cmnCd }) => {
    try {
      openLoading(true);
      setSearchGrCd(cmnGrCd || "");
      setSearchUseYn(filterChipUseYn);
      setSearchCode(cmnCd || "");
    } catch (e) {
      showMessageBar({
        message: t(
          "code.label.조회에 실패하였습니다",
          "조회에 실패하였습니다.",
        ),
        usecase: "error",
      });
    } finally {
      openLoading(false);
    }
  });

  return (
    <>
      <SearchArea
        searchButtonLabel={String(t("common.button.조회", "__조회"))}
        conditions={
          <>
            <Grid item xs={4}>
              <FormItem
                label={`${t("code.label.그룹코드/명", "그룹코드/명") ?? "그룹코드/명"}`}
                labelAlign="right"
                render={() => (
                  <Controller
                    control={control}
                    name="cmnGrCd"
                    render={({ field }) => (
                      <InputField
                        {...field}
                        ref={undefined}
                        size="medium"
                        variant="outlined"
                        placeholder={
                          t("code.label.입력하세요", "입력하세요") ??
                          "입력하세요"
                        }
                        fullWidth={true}
                        autoComplete="off"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSubmit();
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <FormItem
                label={`${t("code.label.코드/명", "코드/명") ?? "코드/명"}`}
                labelAlign="right"
                render={() => (
                  <Controller
                    control={control}
                    name="cmnCd"
                    render={({ field }) => (
                      <InputField
                        {...field}
                        ref={undefined}
                        size="medium"
                        variant="outlined"
                        placeholder={
                          t("code.label.입력하세요", "입력하세요") ??
                          "입력하세요"
                        }
                        fullWidth={true}
                        autoComplete="off"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSubmit();
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <FormItem
                label={`${t("code.label.사용여부", "사용여부") ?? "사용여부"}`}
                labelAlign="right"
                style={{ height: "100%" }}
                render={() => (
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="4px"
                    sx={{ height: "32px" }}
                  >
                    <RadioGroup
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "12px",
                        height: "32px",
                        alignItems: "center",
                      }}
                      value={filterChipUseYn}
                      onChange={(e, v) => {
                        setFilterChipUseYn(v);
                        setSearchUseYn(v);
                      }}
                    >
                      <Radio
                        labelText={t("common.option.전체", "전체") ?? "전체"}
                        value={""}
                      />
                      <Radio
                        labelText={t("common.option.사용", "사용") ?? "사용"}
                        value={"Y"}
                      />
                      <Radio
                        labelText={
                          t("common.option.사용안함", "사용안함") ?? "사용안함"
                        }
                        value={"N"}
                      />
                    </RadioGroup>
                  </Box>
                )}
              />
            </Grid>
          </>
        }
        onSearch={onSubmit}
      />
      <Spacer type="h" size="12" />
      <CodeGroupGrid
        sGrCd={searchGrCd}
        sCode={searchCode}
        sUseYn={searchUseYn}
        editable={true}
        callBack={() => {}}
      />
      <Spacer type="h" size="8" />
      <MessageModal />
    </>
  );
}

export { CodePage };

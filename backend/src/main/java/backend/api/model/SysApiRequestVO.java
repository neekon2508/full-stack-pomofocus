package backend.api.model;

import backend.common.model.CrudVO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class SysApiRequestVO extends CrudVO{

    @Schema(description = "API ID", example = "1")
    private Long id;

    @Schema(description = "API Name", example = "")
    private String apiName;

    @Schema(description = "Api URL", example = "/api/tasks")
    private String apiUrl;

    @Schema(description = "Api Method", example = "GET")
    private String apiMethod;

    @Schema(description = "API Code", example = "TASK_VIEW")
    private String apiCode;
}

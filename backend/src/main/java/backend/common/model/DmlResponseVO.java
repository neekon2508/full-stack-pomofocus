package backend.common.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_ABSENT)
public class DmlResponseVO {

    @Schema(description = "Inserted Rows", example = "1")
    private Integer insertedRows;

    @Schema(description = "Updated Rows", example = "2")
    private Integer updatedRows;

    @Schema(description = "Deleted Rows", example = "3")
    private Integer deletedRows;
}

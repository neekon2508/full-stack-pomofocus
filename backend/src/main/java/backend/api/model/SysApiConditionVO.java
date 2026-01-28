package backend.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access =  AccessLevel.PRIVATE)
@NoArgsConstructor
@Data
@Builder
public class SysApiConditionVO {

    @Schema(description = "API Name", example = "View Tasks")
    private String apiName;

    @Schema(description = "API Url", example = "/api/tasks")
    private String apiUrl;
}

package backend.common.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Data
@SuperBuilder
public class PaginationRequestVO {

    @Builder.Default
    @Positive
    @Schema(description = "pageSize(default: 10)", example = "10")
    private Integer pageSize = 10;

    @Builder.Default
    @PositiveOrZero
    @Schema(description = "start(default: 0)", example = "0")
    private Integer start = 0;
}

package backend.message.model;

import backend.common.model.PaginationRequestVO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class MessageConditionVO extends PaginationRequestVO {

    @NotBlank
    @Schema(description = "Message key", example = "menu.label.head")
    private String messageKey;

    @NotBlank
    @Schema(description = "Language Code", example = "vi")
    private String langCode;

    @NotNull
    @Schema(description = "Message Text", example = "Task")
    private String messageText;
}

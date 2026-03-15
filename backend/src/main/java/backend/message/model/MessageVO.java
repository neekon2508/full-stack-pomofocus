package backend.message.model;

import java.io.Serializable;

import backend.common.model.CrudVO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class MessageVO extends CrudVO {

    @NotBlank
    @Schema(description = "Message key", example = "menu.label.head")
    private String messageKey;

    @NotBlank
    @Schema(description = "Language Code", example = "vi")
    private String langCode;

    @NotNull
    @Schema(description = "Message Text", example = "Task")
    private String messageText;

    private String optionalValueKey1;

    private String optionalValueKey2;

    private String optionalValueKey3;

}

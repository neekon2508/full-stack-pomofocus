package backend.message.model;

import java.io.Serializable;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class MessageSimpleVO implements Serializable {

    private String messageKey;

    private String langCode;

    private String messageText;

    @Override
    public String toString() {
        return "MessageSimpleVO{" +
                "messageKey='" + messageKey + '\'' +
                ", langCode='" + langCode + '\'' +
                ", messageText='" + messageText + '\'' +
                '}';
    }
}

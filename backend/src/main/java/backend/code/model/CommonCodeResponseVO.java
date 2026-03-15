package backend.code.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@Data
@Builder
public class CommonCodeResponseVO {

    private String commonGroupCode;

    private String commonCode;

    private String commonCodeName;

    private String message_key;

    private String commonCodeDescription;

    private String upperCommonCode;

    private int sortOrder;

    private String useYN;

    private String optionalValueContent1;

    private String optionalValueContent2;

    private String optionalValueContent3;

}

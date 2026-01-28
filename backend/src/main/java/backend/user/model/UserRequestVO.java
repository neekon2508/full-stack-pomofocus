package backend.user.model;

import backend.common.model.CrudVO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Setter
@SuperBuilder
public class UserRequestVO extends CrudVO{

    @Schema(description = "Username", example = "Neekon" )
    private String username;

    @Schema(description = "Email", example = "neekon@gmail.com")
    private String email;

    @Schema(description = "Status", example = "1")
    private Integer status;

}

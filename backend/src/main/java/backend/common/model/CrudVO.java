package backend.common.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public abstract class CrudVO {

    @Schema(description = "Crud Key", example = "C", allowableValues = { "C", "R", "U", "D" })
    private String crudKey;

    public String getCrudKey() {
        return crudKey != null ? this.crudKey.toUpperCase() : null;
    }
}

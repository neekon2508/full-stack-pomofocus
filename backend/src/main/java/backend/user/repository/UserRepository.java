package backend.user.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import backend.user.model.UserResponseVO;
import io.lettuce.core.dynamic.annotation.Param;

@Mapper
public interface UserRepository {
    UserResponseVO findUserById(@Param("id") String id);
}

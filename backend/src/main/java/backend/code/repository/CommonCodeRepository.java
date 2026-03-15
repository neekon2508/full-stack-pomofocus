package backend.code.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import backend.code.model.CommonCodeResponseVO;

@Mapper
public interface CommonCodeRepository {

    List<CommonCodeResponseVO> selectCommonCodes(@Param("commonGroupCode") String commonGroupCode);
}

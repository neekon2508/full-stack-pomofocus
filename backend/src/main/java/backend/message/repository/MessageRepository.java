package backend.message.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import backend.message.model.MessageConditionVO;
import backend.message.model.MessageSimpleVO;
import backend.message.model.MessageVO;

@Mapper
public interface MessageRepository {

    // List<MessageVO> selectMessages(@Param("messageCondition") MessageConditionVO
    // messageConditionVO);

    MessageSimpleVO selectMessageCache(@Param("messageKey") String messageKey, @Param("langCode") String langCd);

    List<MessageVO> selectTranslatedMessages(@Param("langCode") String landCd);

    List<MessageSimpleVO> selectMessagesAllCache();

    int insertMessage(@Param("message") MessageVO messageVO);

    int updateMessage(@Param("message") MessageVO messageVO);

    int deleteMessage(MessageVO messageVO);
}

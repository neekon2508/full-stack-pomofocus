package backend.message.service;

import java.util.Map;

import backend.message.model.MessageSimpleVO;
import backend.message.model.MessageVO;

public interface MessageService {

    Map<String, String> readTranslatedMessageFile(String landCd);

    boolean deployTranslatedMessages(String landCd);

    boolean deployTranslatedMessagesAll();

    MessageSimpleVO findMessageCache(String messageKey, String landCode);

    public int refreshMessageAll();

    int createMessage(MessageVO messageVO);

    int modifyMessage(MessageVO messageVO);

    int removeMessage(String messageKey, String landCd);

}

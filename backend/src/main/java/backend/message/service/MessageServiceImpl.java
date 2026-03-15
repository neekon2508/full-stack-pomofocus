package backend.message.service;

import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.cache.Cache;
import javax.cache.CacheManager;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nimbusds.jose.shaded.gson.Gson;
import com.nimbusds.jose.shaded.gson.GsonBuilder;

import backend.code.model.CommonCodeResponseVO;
import backend.code.repository.CommonCodeRepository;
import backend.common.constant.StatusCodeConstants;
import backend.common.exception.BusinessException;
import backend.common.util.ValidateUtil;
import backend.message.model.MessageSimpleVO;
import backend.message.model.MessageVO;
import backend.message.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    @Value("${i18n.message-file-path}")
    private String messageFilePath;

    @Value("${i18n.upload-cache-on-start}")
    private boolean isUploadCacheOnStart;

    private final MessageRepository messageRepository;
    private final CommonCodeRepository commonCodeRepository;

    private final CacheManager cacheManager;

    private static Gson gson = new GsonBuilder().setPrettyPrinting().create();

    @Override
    public Map<String, String> readTranslatedMessageFile(String landCd) {

        Path jsonFilePath = Paths.get(messageFilePath, "message_" + landCd + ".json");
        try (BufferedReader reader = Files.newBufferedReader(jsonFilePath, StandardCharsets.UTF_8)) {
            Map<String, String> result = gson.fromJson(reader, Map.class);
            return result != null ? result : Collections.emptyMap();
        } catch (IOException e) {
            throw new BusinessException("message read failed", StatusCodeConstants.MESSAGE_READ_FAILED, e);
        }
    }

    @Override
    public boolean deployTranslatedMessages(String landCd) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deployTranslatedMessagesAll'");
    }

    @Override
    @Transactional(rollbackFor = { Exception.class })
    public boolean deployTranslatedMessagesAll() {
        List<String> languageCodes = findValidLanguageCode();

        if (!ValidateUtil.isEmpty(languageCodes)) {
            for (String langCd : languageCodes) {
                List<MessageVO> messageList = messageRepository.selectTranslatedMessages(langCd);
                Map<String, String> messageMap = messageList.stream()
                        .collect(Collectors.toMap(MessageVO::getMessageKey, MessageVO::getMessageText));
                String jsonData = gson.toJson(messageMap);
                String filePath = messageFilePath + "/message_" + langCd + ".json";
                try (FileWriter writer = new FileWriter(filePath, StandardCharsets.UTF_8)) {
                    writer.write(jsonData);
                } catch (IOException e) {
                    throw new BusinessException("message deploy failed", StatusCodeConstants.MESSAGE_DEPLOY_FAILED, e);
                }
            }
        }
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "i18nCache", key = "#messageKey + #langCode")
    public MessageSimpleVO findMessageCache(String messageKey, String langCode) {
        MessageSimpleVO message = messageRepository.selectMessageCache(messageKey, langCode);
        return message;
    }

    @Override
    @Transactional(readOnly = true)
    @EventListener(ApplicationReadyEvent.class)
    public int refreshMessageAll() {
        if (!isUploadCacheOnStart)
            return 0;

        log.info("i18n Message Loading...");

        List<MessageSimpleVO> messages = messageRepository.selectMessagesAllCache();
        if (ValidateUtil.isEmpty(messages))
            return 0;
        log.info("i18n Select all messages from DB table : {} rows", messages.size());

        Cache i18nCache = cacheManager.getCache("i18nCache");

        log.info("i18n Cache clear");
        i18nCache.removeAll();

        for (MessageSimpleVO message : messages)
            i18nCache.put(message.getMessageKey() + message.getLangCode(), message);
        log.info("i18n Cache reload completed.");
        return messages.size();
    }

    @Override
    public int createMessage(MessageVO messageVO) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createMessage'");
    }

    @Override
    public int modifyMessage(MessageVO messageVO) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'modifyMessage'");
    }

    @Override
    public int removeMessage(String messageKey, String landCd) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'removeMessage'");
    }

    private List<String> findValidLanguageCode() {
        return commonCodeRepository.selectCommonCodes("LANG_CD").stream().map(CommonCodeResponseVO::getCommonCode)
                .collect(Collectors.toList());
    }
}

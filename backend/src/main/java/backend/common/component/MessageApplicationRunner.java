package backend.common.component;

import java.util.concurrent.CompletableFuture;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import backend.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class MessageApplicationRunner implements ApplicationRunner {

    private final MessageService messageService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        CompletableFuture.runAsync(() -> {
            try {
                log.info("Starting message deployment in background...");
                messageService.deployTranslatedMessagesAll();
                log.info("Message deployment  completed successfully.");
            } catch (Exception e) {
                log.error(
                        "Failed to deploy translated messages during startup. This will not prevent application startup.",
                        e);
            }
        });
    }

}

package backend.message.controller;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.annotation.ApiGroup;
import backend.common.constant.CommonConstants;
import backend.common.constant.StatusCodeConstants;
import backend.common.model.CommonResponseVO;
import backend.message.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@ApiGroup(value = "Translated Message API")
@Tag(name = "Transalted Message", description = "Translated message API")
@RequestMapping("/api")
public class TranslatedMessageController {

    private final MessageService messageService;

    @Operation(summary = "Get translated Messages")
    @GetMapping(value = "/translated-messages", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CommonResponseVO<Map<String, String>>> getTranslatedMessages(
            @RequestParam @Parameter(name = "langCode", description = "language code", example = "ko") String langCode) {

        return ResponseEntity.ok(CommonResponseVO.<Map<String, String>>builder()
                .successOrNot(CommonConstants.YES_FLAG)
                .statusCode(StatusCodeConstants.SUCCESS)
                .data(messageService.readTranslatedMessageFile(langCode))
                .build());
    }
}

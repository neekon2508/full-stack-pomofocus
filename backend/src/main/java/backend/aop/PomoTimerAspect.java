package backend.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import backend.annotation.PomoTimer;
import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class PomoTimerAspect {

    public Object handleTimer(ProceedingJoinPoint joinPoint, PomoTimer pomoTimer) throws Throwable {
        String type = pomoTimer.sessionType();
        log.info("[AOP] Session start: {}", type);
        long startTime = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();

            long duration = System.currentTimeMillis() - startTime;
            log.info("[AOP] Session {} end. Time: {}ms", type, duration);
            return result;
        } catch (Throwable e) {
            log.error("[AOP] Session {} failed: {}", type, e.getMessage());
            throw e;
        }

    }
}

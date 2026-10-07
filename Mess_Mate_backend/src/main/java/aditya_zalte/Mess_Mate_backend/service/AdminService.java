
        package aditya_zalte.Mess_Mate_backend.service;

import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.repository.MessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

        @Service
@RequiredArgsConstructor
public class AdminService {

    private final MessRepository messRepository;

    public Optional<Mess> getPendingMesses() {
        return messRepository.findByIsVerifiedFalse();
    }

    public void verifyMess(String messId) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() ->
                        new IllegalStateException("Mess not found"));

        mess.setIsVerified(true);
        messRepository.save(mess);
    }

    public void unverifyMess(String messId) {
        Mess mess = messRepository.findById(messId)
                .orElseThrow(() ->
                        new IllegalStateException("Mess not found"));

        mess.setIsVerified(false);
        messRepository.save(mess);
    }
}

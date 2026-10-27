package aditya_zalte.Mess_Mate_backend.service;

import aditya_zalte.Mess_Mate_backend.dto.AdminMessDto;
import aditya_zalte.Mess_Mate_backend.exception.MessNotFoundException;
import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.repository.DailyMenuRepository;
import aditya_zalte.Mess_Mate_backend.repository.MessRepository;
import aditya_zalte.Mess_Mate_backend.repository.RatingRepository;
import aditya_zalte.Mess_Mate_backend.repository.WeeklyMenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final MessRepository messRepository;
    private final WeeklyMenuRepository weeklyMenuRepository;
    private final DailyMenuRepository dailyMenuRepository;
    private final RatingRepository ratingRepository;

    // status = "pending" | "verified" | "all"
    @Transactional(readOnly = true)
    public List<AdminMessDto> getMesses(String status) {
        return messRepository.findAll().stream()
                .filter(m -> switch (status == null ? "all" : status.toLowerCase()) {
                    case "pending" -> !Boolean.TRUE.equals(m.getIsVerified());
                    case "verified" -> Boolean.TRUE.equals(m.getIsVerified());
                    default -> true;
                })
                .sorted(Comparator.comparing(
                        Mess::getCreatedAt,
                        Comparator.nullsLast(Comparator.<LocalDateTime>reverseOrder())))
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public AdminMessDto setVerified(String messId, boolean verified) {
        Mess mess = findMess(messId);
        mess.setIsVerified(verified);
        return toDto(messRepository.save(mess));
    }

    // Children first, parent last. Owner account is kept.
    @Transactional
    public void deleteMess(String messId) {
        Mess mess = findMess(messId);

        ratingRepository.deleteByMessId(messId);
        dailyMenuRepository.deleteByMessId(messId);
        weeklyMenuRepository.deleteByMessId(messId);

        messRepository.delete(mess);
    }

    private Mess findMess(String messId) {
        return messRepository.findById(messId)
                .orElseThrow(() -> new MessNotFoundException("Mess not found"));
    }

    private AdminMessDto toDto(Mess m) {
        AdminMessDto dto = new AdminMessDto();
        dto.setId(m.getId());
        dto.setName(m.getName());
        dto.setAddress(m.getAddress());
        dto.setCity(m.getCity());
        dto.setLocality(m.getLocality());
        dto.setLatitude(m.getLatitude());
        dto.setLongitude(m.getLongitude());
        dto.setAvgPricePerMeal(m.getAvgPricePerMeal());
        dto.setCoverImageUrl1(m.getCoverImageUrl1());
        dto.setIsVerified(m.getIsVerified());
        dto.setIsActive(m.getIsActive());
        dto.setCreatedAt(m.getCreatedAt());

        MessOwner owner = m.getOwner(); // lazy: only works inside @Transactional
        if (owner != null) {
            dto.setOwnerName(owner.getName());
            dto.setOwnerEmail(owner.getEmail());
            dto.setOwnerPhone(owner.getPhoneNumber());
        }
        return dto;
    }
}
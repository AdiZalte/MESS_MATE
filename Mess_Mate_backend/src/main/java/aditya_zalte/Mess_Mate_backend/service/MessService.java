package aditya_zalte.Mess_Mate_backend.service;

import aditya_zalte.Mess_Mate_backend.dto.CreateMessDto;
import aditya_zalte.Mess_Mate_backend.dto.MessResponseDto;
import aditya_zalte.Mess_Mate_backend.exception.MessNotFoundException;
import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.repository.MessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessService {

    private final MessRepository messRepository;

    public void createMess(CreateMessDto dto, MessOwner owner) {
        // Enforce one mess per owner — this is your "one-time form" rule

        if (messRepository.findByOwnerId(owner.getId()).isPresent()) {
            throw new IllegalStateException("This owner has already registered a mess");
        }

        Mess mess = new Mess();
        mess.setOwner(owner);
        mess.setName(dto.getName());
        mess.setDescription(dto.getDescription());
        mess.setAddress(dto.getAddress());
        mess.setCity(dto.getCity());
        mess.setLocality(dto.getLocality());
        mess.setLatitude(dto.getLatitude());
        mess.setLongitude(dto.getLongitude());
        mess.setMessType(dto.getMessType());
        mess.setPriceType(dto.getPriceType());
        mess.setAvgPricePerMeal(dto.getAvgPricePerMeal());
        mess.setOpeningTime(dto.getOpeningTime());
        mess.setClosingTime(dto.getClosingTime());
        mess.setCoverImageUrl1(dto.getCoverImageUrl1());
        mess.setCoverImageUrl2(dto.getCoverImageUrl2());
        mess.setCoverImageUrl3(dto.getCoverImageUrl3());
        mess.setIsVeg(dto.getIsVeg() != null ? dto.getIsVeg() : true);
        mess.setIsTiffin(dto.getIsTiffin() != null ? dto.getIsTiffin() : false);
        mess.setIsActive(true);
        mess.setIsVerified(false);

        messRepository.save(mess);
    }
    public MessResponseDto getMyMess(MessOwner owner) {
        Mess mess = messRepository.findByOwnerId(owner.getId())
                .orElseThrow(() -> new MessNotFoundException("No mess registered yet"));

        return toDto(mess);
    }

    private MessResponseDto toDto(Mess mess) {
        MessResponseDto dto = new MessResponseDto();
        dto.setId(mess.getId());
        dto.setName(mess.getName());
        dto.setDescription(mess.getDescription());
        dto.setAddress(mess.getAddress());
        dto.setCity(mess.getCity());
        dto.setLocality(mess.getLocality());
        dto.setLatitude(mess.getLatitude());
        dto.setLongitude(mess.getLongitude());
        dto.setMessType(mess.getMessType());
        dto.setPriceType(mess.getPriceType());
        dto.setAvgPricePerMeal(mess.getAvgPricePerMeal());
        dto.setOpeningTime(mess.getOpeningTime());
        dto.setClosingTime(mess.getClosingTime());
        dto.setCoverImageUrl1(mess.getCoverImageUrl1());
        dto.setCoverImageUrl2(mess.getCoverImageUrl2());
        dto.setCoverImageUrl3(mess.getCoverImageUrl3());
        dto.setIsActive(mess.getIsActive());
        dto.setIsVerified(mess.getIsVerified());
        dto.setAvgRating(mess.getAvgRating());
        dto.setTotalRatings(mess.getTotalRatings());
        return dto;
    }
}
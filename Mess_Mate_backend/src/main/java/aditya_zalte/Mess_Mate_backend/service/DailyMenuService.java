package aditya_zalte.Mess_Mate_backend.service;

import aditya_zalte.Mess_Mate_backend.dto.DailyMenuResponseDto;
import aditya_zalte.Mess_Mate_backend.dto.DailyMenuUpsertDto;
import aditya_zalte.Mess_Mate_backend.dto.MenuItemDto;
import aditya_zalte.Mess_Mate_backend.dto.WeeklyMenuUpsertDto;
import aditya_zalte.Mess_Mate_backend.model.DailyMenu;
import aditya_zalte.Mess_Mate_backend.model.DailyMenuItem;
import aditya_zalte.Mess_Mate_backend.model.MenuItem;
import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.repository.DailyMenuRepository;
import aditya_zalte.Mess_Mate_backend.repository.MenuItemRepository;
import aditya_zalte.Mess_Mate_backend.repository.MessRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailyMenuService {

    private final DailyMenuRepository dailyMenuRepository;
    private final MenuItemRepository menuItemRepository;
    private final MessRepository messRepository;

    public void upsertOneDay(DailyMenuUpsertDto dto, Mess mess) {

        Optional<DailyMenu> dailyMenuOptional =
                dailyMenuRepository.findByMessIdAndDate(
                        mess.getId(),
                        dto.getDate()
                );

        DailyMenu dailyMenu;

        if (dailyMenuOptional.isPresent()) {
            dailyMenu = dailyMenuOptional.get();
        } else {
            dailyMenu = new DailyMenu();
        }

        dailyMenu.setMess(mess);
        dailyMenu.setDate(dto.getDate());

        if (dailyMenu.getItems() != null) {
            dailyMenu.getItems().clear();
        } else {
            dailyMenu.setItems(new ArrayList<>());
        }

        List<DailyMenuItem> newItems = dto.getItems()
                .stream()
                .map(itemDto -> {

                    Optional<MenuItem> menuItemOptional =
                            menuItemRepository.findByNameIgnoreCaseAndIsVeg(
                                    itemDto.getName(),
                                    itemDto.getIsVeg()
                            );

                    MenuItem menuItem;

                    if (menuItemOptional.isPresent()) {
                        menuItem = menuItemOptional.get();
                    } else {
                        menuItem = new MenuItem();
                        menuItem.setName(itemDto.getName());
                        menuItem.setIsVeg(itemDto.getIsVeg());

                        menuItem = menuItemRepository.save(menuItem);
                    }

                    DailyMenuItem dmi = new DailyMenuItem();

                    dmi.setDailyMenu(dailyMenu);
                    dmi.setMenuItem(menuItem);

                    return dmi;
                })
                .collect(Collectors.toList());

        dailyMenu.getItems().addAll(newItems);

        dailyMenuRepository.save(dailyMenu);
    }

    public List<DailyMenuResponseDto> getWeek(MessOwner owner) {

        Optional<Mess> messOptional =
                messRepository.findByOwnerId(owner.getId());

        if (messOptional.isEmpty()) {
            throw new IllegalStateException("No mess registered");
        }

        Mess mess = messOptional.get();

        LocalDate today = LocalDate.now();
        LocalDate weekEnd = today.plusDays(6);

        return dailyMenuRepository
                .findByMessIdAndDateBetweenOrderByDateAsc(
                        mess.getId(),
                        today,
                        weekEnd
                )
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private DailyMenuResponseDto toDto(DailyMenu dailyMenu) {

        DailyMenuResponseDto dto = new DailyMenuResponseDto();

        dto.setId(dailyMenu.getId());
        dto.setDate(dailyMenu.getDate());

        dto.setItems(
                dailyMenu.getItems()
                        .stream()
                        .map(dmi -> {

                            MenuItemDto itemDto = new MenuItemDto();

                            itemDto.setName(
                                    dmi.getMenuItem().getName()
                            );

                            itemDto.setIsVeg(
                                    dmi.getMenuItem().getIsVeg()
                            );

                            return itemDto;
                        })
                        .collect(Collectors.toList())
        );

        return dto;
    }
}
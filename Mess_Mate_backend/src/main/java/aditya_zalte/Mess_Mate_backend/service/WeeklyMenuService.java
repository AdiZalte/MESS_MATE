package aditya_zalte.Mess_Mate_backend.service;

import aditya_zalte.Mess_Mate_backend.dto.WeeklyMenuDayDto;
import aditya_zalte.Mess_Mate_backend.dto.WeeklyMenuItemDto;
import aditya_zalte.Mess_Mate_backend.dto.WeeklyMenuResponseDto;
import aditya_zalte.Mess_Mate_backend.model.MenuItem;
import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.model.WeeklyMenu;
import aditya_zalte.Mess_Mate_backend.model.WeeklyMenuItem;
import aditya_zalte.Mess_Mate_backend.repository.MenuItemRepository;
import aditya_zalte.Mess_Mate_backend.repository.MessRepository;
import aditya_zalte.Mess_Mate_backend.repository.WeeklyMenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WeeklyMenuService {

    private final WeeklyMenuRepository weeklyMenuRepository;
    private final MenuItemRepository menuItemRepository;
    private final MessRepository messRepository;

    @Transactional
    public void saveWeeklyMenu(
            List<WeeklyMenuDayDto> days,
            MessOwner owner
    ) {
        Optional<Mess> messOptional =
                messRepository.findByOwnerId(owner.getId());

        if (messOptional.isEmpty()) {
            throw new IllegalStateException("No mess registered");
        }

        Mess mess = messOptional.get();

        if (!Boolean.TRUE.equals(mess.getIsVerified())) {
            throw new IllegalStateException(
                    "Mess must be verified before adding a menu"
            );
        }

        for (WeeklyMenuDayDto day : days) {

            Optional<WeeklyMenu> weeklyMenuOptional =
                    weeklyMenuRepository.findByMessIdAndDayOfWeek(
                            mess.getId(),
                            day.getDayOfWeek()
                    );

            WeeklyMenu weeklyMenu;

            if (weeklyMenuOptional.isPresent()) {
                weeklyMenu = weeklyMenuOptional.get();
                weeklyMenu.getItems().clear();
            } else {
                weeklyMenu = new WeeklyMenu();
                weeklyMenu.setMess(mess);
                weeklyMenu.setDayOfWeek(day.getDayOfWeek());
                weeklyMenu.setItems(new ArrayList<>());
            }

            for (WeeklyMenuItemDto itemDto : day.getItems()) {

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

                WeeklyMenuItem weeklyMenuItem = new WeeklyMenuItem();
                weeklyMenuItem.setWeeklyMenu(weeklyMenu);
                weeklyMenuItem.setMenuItem(menuItem);

                weeklyMenu.getItems().add(weeklyMenuItem);
            }

            weeklyMenuRepository.save(weeklyMenu);
        }
    }

    @Transactional(readOnly = true)
    public WeeklyMenuResponseDto getWeeklyMenu(MessOwner owner) {

        Optional<Mess> messOptional =
                messRepository.findByOwnerId(owner.getId());

        if (messOptional.isEmpty()) {
            throw new IllegalStateException("No mess registered");
        }

        Mess mess = messOptional.get();

        List<WeeklyMenu> weeklyMenus =
                weeklyMenuRepository.findByMessIdOrderByDayOfWeek(
                        mess.getId()
                );

        WeeklyMenuResponseDto response = new WeeklyMenuResponseDto();

        List<WeeklyMenuDayDto> days = new ArrayList<>();

        for (WeeklyMenu weeklyMenu : weeklyMenus) {

            WeeklyMenuDayDto day = new WeeklyMenuDayDto();
            day.setDayOfWeek(weeklyMenu.getDayOfWeek());

            List<WeeklyMenuItemDto> items = new ArrayList<>();

            for (WeeklyMenuItem weeklyMenuItem : weeklyMenu.getItems()) {

                WeeklyMenuItemDto item = new WeeklyMenuItemDto();
                item.setName(
                        weeklyMenuItem.getMenuItem().getName()
                );
                item.setIsVeg(
                        weeklyMenuItem.getMenuItem().getIsVeg()
                );

                items.add(item);
            }

            day.setItems(items);
            days.add(day);
        }

        response.setDays(days);

        return response;
    }
}
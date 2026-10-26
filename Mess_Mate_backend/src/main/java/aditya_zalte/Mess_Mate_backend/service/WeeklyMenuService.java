package aditya_zalte.Mess_Mate_backend.service;

import aditya_zalte.Mess_Mate_backend.dto.WeeklyMenuDayDto;
import aditya_zalte.Mess_Mate_backend.dto.WeeklyMenuItemDto;
import aditya_zalte.Mess_Mate_backend.dto.WeeklyMenuResponseDto;
import aditya_zalte.Mess_Mate_backend.model.MenuItem;
import aditya_zalte.Mess_Mate_backend.model.Mess;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.model.WeeklyMenu;
import aditya_zalte.Mess_Mate_backend.model.WeeklyMenuItem;
import aditya_zalte.Mess_Mate_backend.model.enums.DayOfWeek;
import aditya_zalte.Mess_Mate_backend.model.enums.MealType;
import aditya_zalte.Mess_Mate_backend.repository.MenuItemRepository;
import aditya_zalte.Mess_Mate_backend.repository.MessRepository;
import aditya_zalte.Mess_Mate_backend.repository.WeeklyMenuItemRepository;
import aditya_zalte.Mess_Mate_backend.repository.WeeklyMenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class WeeklyMenuService {

    private final WeeklyMenuRepository weeklyMenuRepository;
    private final MenuItemRepository menuItemRepository;
    private final MessRepository messRepository;
    private final WeeklyMenuItemRepository weeklyMenuItemRepository;


    @Transactional
    public void saveWeeklyMenu(
            List<WeeklyMenuDayDto> days,
            MessOwner owner
    ) {
        if (days.size() != 7) {
            throw new IllegalArgumentException(
                    "Weekly menu must contain exactly 7 days"
            );
        }

        Set<DayOfWeek> daySet = new HashSet<>();

        for (WeeklyMenuDayDto day : days) {

            if (!daySet.add(day.getDayOfWeek())) {
                throw new IllegalArgumentException(
                        "Duplicate day: " + day.getDayOfWeek()
                );
            }

            Set<MealType> mealTypes = new HashSet<>();

            for (WeeklyMenuItemDto item : day.getItems()) {
                mealTypes.add(item.getMealType());
            }

            if (!mealTypes.contains(MealType.LUNCH) ||
                    !mealTypes.contains(MealType.DINNER)) {
                throw new IllegalArgumentException(
                        day.getDayOfWeek() + " must contain both lunch and dinner"
                );
            }
        }

        Optional<Mess> messOptional =
                messRepository.findFirstByOwnerId(owner.getId());

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
                weeklyMenuRepository.saveAndFlush(weeklyMenu);
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
                weeklyMenuItem.setMealType(itemDto.getMealType());

                weeklyMenu.getItems().add(weeklyMenuItem);
            }

            weeklyMenuRepository.save(weeklyMenu);
        }
    }
    @Transactional(readOnly = true)
    public WeeklyMenuResponseDto getWeeklyMenu(Mess mess) {

        List<WeeklyMenu> weeklyMenus =
                weeklyMenuRepository.findByMessId(mess.getId());

        weeklyMenus.sort(
                Comparator.comparingInt(menu ->
                        menu.getDayOfWeek().ordinal()
                )
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

                item.setMealType(
                        weeklyMenuItem.getMealType()
                );

                items.add(item);
            }

            day.setItems(items);
            days.add(day);
        }

        response.setDays(days);

        return response;
    }

    @Transactional(readOnly = true)
    public WeeklyMenuResponseDto getWeeklyMenu(MessOwner owner) {

        Optional<Mess> messOptional =
                messRepository.findFirstByOwnerId(owner.getId());

        if (messOptional.isEmpty()) {
            throw new IllegalStateException("No mess registered");
        }

        Mess mess = messOptional.get();

        List<WeeklyMenu> weeklyMenus =
                weeklyMenuRepository.findByMessId(mess.getId());

        weeklyMenus.sort(
                Comparator.comparingInt(menu ->
                        menu.getDayOfWeek().ordinal()
                )
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

                item.setMealType(
                        weeklyMenuItem.getMealType()
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
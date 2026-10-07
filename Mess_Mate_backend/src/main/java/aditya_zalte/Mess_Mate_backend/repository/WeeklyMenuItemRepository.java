package aditya_zalte.Mess_Mate_backend.repository;

import aditya_zalte.Mess_Mate_backend.model.WeeklyMenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeeklyMenuItemRepository
        extends JpaRepository<WeeklyMenuItem, String> {
}
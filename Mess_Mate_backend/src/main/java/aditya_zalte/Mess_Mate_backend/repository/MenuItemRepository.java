package aditya_zalte.Mess_Mate_backend.repository;

import aditya_zalte.Mess_Mate_backend.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MenuItemRepository extends JpaRepository<MenuItem, String> {
    Optional<MenuItem> findByNameIgnoreCaseAndIsVeg(String name, Boolean isVeg);
}
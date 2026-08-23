package aditya_zalte.Mess_Mate_backend.security;


import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.repository.MessOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MessOwnerDetailsService implements UserDetailsService {

    private final MessOwnerRepository messOwnerRepository;

    public MessOwnerDetailsService(MessOwnerRepository messOwnerRepository) {
        this.messOwnerRepository = messOwnerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return messOwnerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Mess owner not found with email: " + email));
    }
}
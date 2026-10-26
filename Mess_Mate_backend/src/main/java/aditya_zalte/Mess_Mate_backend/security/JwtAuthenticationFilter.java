package aditya_zalte.Mess_Mate_backend.security;

import aditya_zalte.Mess_Mate_backend.model.Admin;
import aditya_zalte.Mess_Mate_backend.model.MessOwner;
import aditya_zalte.Mess_Mate_backend.repository.AdminRepository;
import aditya_zalte.Mess_Mate_backend.repository.MessOwnerRepository;
import aditya_zalte.Mess_Mate_backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final MessOwnerRepository messOwnerRepository;
    private final AdminRepository adminRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (jwtUtil.isTokenValid(token) &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            String userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            if ("ROLE_ADMIN".equals(role)) {

                Admin admin = adminRepository.findById(userId).orElse(null);

                if (admin != null) {
                    setAuthentication(admin, request);
                }

            } else if ("ROLE_OWNER".equals(role)) {

                MessOwner owner = messOwnerRepository.findById(userId).orElse(null);

                if (owner != null) {
                    setAuthentication(owner, request);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private void setAuthentication(
            Object user,
            HttpServletRequest request
    ) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        ((org.springframework.security.core.userdetails.UserDetails) user)
                                .getAuthorities()
                );

        authToken.setDetails(
                new WebAuthenticationDetailsSource()
                        .buildDetails(request)
        );

        SecurityContextHolder.getContext()
                .setAuthentication(authToken);
    }
}
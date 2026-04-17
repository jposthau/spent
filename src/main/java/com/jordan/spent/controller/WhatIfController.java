package com.jordan.spent.controller;

import com.jordan.spent.dto.WhatIfRequest;
import com.jordan.spent.dto.WhatIfResultDTO;
import com.jordan.spent.repository.UserRepository;
import com.jordan.spent.service.WhatIfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{userId}/whatif")
public class WhatIfController {

    private final UserRepository userRepository;
    private final WhatIfService whatIfService;

    public WhatIfController(UserRepository userRepository, WhatIfService whatIfService) {
        this.userRepository = userRepository;
        this.whatIfService = whatIfService;
    }

    @PostMapping
    public ResponseEntity<WhatIfResultDTO> whatIf(@PathVariable Long userId,
                                                  @RequestBody WhatIfRequest request) {
        return userRepository.findById(userId)
            .map(user -> ResponseEntity.ok(whatIfService.calculate(request, user)))
            .orElse(ResponseEntity.notFound().build());
    }
}

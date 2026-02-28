package com.chessx.logic.infrastructure.presentation;

import com.chessx.logic.application.port.in.AnalysisResult;
import com.chessx.logic.application.port.in.AnalyzePositionUseCase;
import com.chessx.logic.infrastructure.presentation.dto.AnalysisRequest;
import com.chessx.logic.infrastructure.presentation.dto.AnalysisResponse;
import com.chessx.logic.domain.model.FEN;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "http://localhost:3000") // Allows your Next.js frontend to call this API
public class AnalysisController {

    private final AnalyzePositionUseCase analyzePositionUseCase;

    // Spring Boot automatically injects the AnalysisService here
    public AnalysisController(AnalyzePositionUseCase analyzePositionUseCase) {
        this.analyzePositionUseCase = analyzePositionUseCase;
    }

    @PostMapping
    public ResponseEntity<AnalysisResponse> analyze(@RequestBody AnalysisRequest request) {
        try {
            // If no FEN is provided, default to the starting board
            String fenToAnalyze = (request.getFen() != null && !request.getFen().isBlank()) 
                                  ? request.getFen() 
                                  : FEN.STARTING_FEN;

            // Call our application layer
            AnalysisResult result = analyzePositionUseCase.analyze(fenToAnalyze, request.getMove());

            // Map the domain result back to our web DTO
            AnalysisResponse response = new AnalysisResponse(
                result.fen(),
                result.state().name(),
                result.legalMoves()
            );

            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handles invalid FEN strings or illegal move attempts
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
package com.jordan.spent.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jordan.spent.dto.AuditSummaryDTO;
import com.jordan.spent.dto.ExpenseSummaryDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class NarrativeService {

    @Value("${anthropic.api.key:}")
    private String apiKey;

    private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public String generateNarrative(AuditSummaryDTO audit) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                "Anthropic API key not configured. Set anthropic.api.key in application.yaml"
            );
        }

        try {
            String prompt = buildPrompt(audit);

            Map<String, Object> requestBody = Map.of(
                "model", "claude-sonnet-4-6",
                "max_tokens", 1024,
                "messages", List.of(
                    Map.of("role", "user", "content", prompt)
                )
            );

            String requestJson = OBJECT_MAPPER.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.anthropic.com/v1/messages"))
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                .build();

            HttpResponse<String> response = HTTP_CLIENT.send(
                request, HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() != 200) {
                throw new RuntimeException(
                    "Anthropic API returned " + response.statusCode() + ": " + response.body()
                );
            }

            var responseNode = OBJECT_MAPPER.readTree(response.body());
            return responseNode.path("content").path(0).path("text").asText();

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate narrative: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(AuditSummaryDTO audit) {
        var sb = new StringBuilder();

        sb.append("""
            You are a personal financial analyst writing a plain-English audit narrative for a user.
            Write in second person ("you" / "your"). Use the exact numbers provided — never round or approximate.
            Be emotionally resonant but not alarmist: empowering and clear-eyed, not scary.
            Write exactly 3 paragraphs with no headers or bullet points.

            Cover all four of these in the narrative:
            1. The headline break-even stat — the specific hour of the day they first start keeping money for themselves.
            2. Their biggest time costs — name the top expenses by hours, explain what that means concretely.
            3. A lifetime projection — extrapolate over 10 years to show cumulative time cost.
            4. One specific, actionable insight — a concrete thing they could change to reclaim meaningful hours.

            Here is the user's financial audit data:
            """);

        sb.append(String.format("- True hourly rate (after taxes): $%.2f/hr%n", audit.trueHourlyRate()));
        sb.append(String.format("- Gross annual income: $%.0f%n", audit.grossAnnualIncome()));
        sb.append(String.format("- Net annual income (after taxes): $%.0f%n", audit.netAnnualIncome()));
        sb.append(String.format("- Annual hours worked: %.0f hours/year%n", audit.annualHours()));
        sb.append(String.format("- Total monthly expenses: $%.0f/month%n", audit.totalMonthlyExpenses()));
        sb.append(String.format("- Total annual expenses: $%.0f/year%n", audit.totalAnnualExpenses()));
        sb.append(String.format("- Hours worked to cover all expenses: %.1f hours/year%n", audit.totalHoursForExpenses()));
        sb.append(String.format("- Weeks worked for expenses: %.1f of 52 weeks%n", audit.weeksWorkedForExpenses()));
        sb.append(String.format("- Break-even hour: %.1fh into the workday%n", audit.breakEvenHour()));
        sb.append(String.format("- Weeks kept for yourself: %.1f weeks%n", audit.weeksKept()));
        sb.append(String.format("- Percentage of net income spent on expenses: %.1f%%%n%n", audit.percentageOfIncomeToExpenses()));

        var topExpenses = audit.expenseBreakdown().stream()
            .sorted((a, b) -> b.annualCost().compareTo(a.annualCost()))
            .limit(3)
            .toList();

        sb.append("Top expenses by annual cost:\n");
        for (ExpenseSummaryDTO e : topExpenses) {
            sb.append(String.format("- %s (%s): $%.0f/year = %.1f hours/year (%.1f%% of total expenses)%n",
                e.name(), e.category(), e.annualCost(), e.hoursWorked(), e.percentageOfTotalExpenses()));
        }

        sb.append("\nWrite the 3-paragraph narrative now:");

        return sb.toString();
    }
}

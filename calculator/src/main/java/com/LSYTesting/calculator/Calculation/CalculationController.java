package com.LSYTesting.calculator.Calculation;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CalculationController {

    @GetMapping("/calculate")
    public String calculate(
            @RequestParam double num1,
            @RequestParam String operation,
            @RequestParam double num2) {

        double result = 0;
        String error = null;

        switch (operation) {
            case "add":
                result = num1 + num2;
                break;
            case "subtract":
                result = num1 - num2;
                break;
            case "multiply":
                result = num1 * num2;
                break;
            case "divide":
                if (num2 == 0) {
                    return "Error: Division by zero is not allowed!";
                }
                result = num1 / num2;
                break;
            default:
                return "Invalid operation!";
        }

        return String.valueOf(result);
    }
}

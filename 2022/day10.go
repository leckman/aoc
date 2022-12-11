package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strings"
)

const FIRST_IMPORTANT_CYCLE = 20
const CYCLE_INTERVAL = 40

func addIfImportant(important map[int]int, register int, cycle int) {
	if (cycle-FIRST_IMPORTANT_CYCLE)%CYCLE_INTERVAL == 0 {
		important[cycle] = register
	}
}

func sumSignalStrengths(important map[int]int) int {
	total := 0
	for k := range important {
		total += k * important[k]
	}
	return total
}

const ROW_SIZE = 40

func drawPixel(crt [][]string, register int, cycle int) {
	correctedCycle := cycle - 1
	col := correctedCycle % ROW_SIZE
	if math.Abs(float64(col-register)) < 2 {
		row := correctedCycle / ROW_SIZE
		crt[row][col] = "#"
	}
}

func play(directions []string) {
	register := 1
	cycle := 0

	importantRegisters := make(map[int]int)
	crt := make([][]string, 6)
	for i := range crt {
		row := make([]string, ROW_SIZE)
		for j := range row {
			row[j] = " "
		}
		crt[i] = row
	}

	for _, direction := range directions {
		var change int
		if direction == "noop" {
			cycle += 1
		} else {
			_, err := fmt.Sscanf(direction, "addx %d", &change)
			if err != nil {
				panic(fmt.Errorf("could not parse directive: %s", direction))
			}
			cycle += 2
			drawPixel(crt, register, cycle-1)
			// In case we bypass the important cycle
			addIfImportant(importantRegisters, register, cycle-1)
		}
		drawPixel(crt, register, cycle)
		addIfImportant(importantRegisters, register, cycle)
		// Update happens after the cycle completes
		register += change
	}

	fmt.Println("Part 1:")
	fmt.Println(sumSignalStrengths(importantRegisters))

	fmt.Println("Part 2:")
	for _, row := range crt {
		fmt.Println(strings.Join(row, ""))
	}
}

func getData() ([]string, error) {
	var lines []string

	file, err := os.Open("day10.txt")
	if err != nil {
		return lines, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		lines = append(lines, line)
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading file:", err)
		return lines, err
	}

	return lines, nil
}

func main() {
	data, err := getData()
	if err != nil {
		fmt.Println(err)
		return
	}
	play(data)
}

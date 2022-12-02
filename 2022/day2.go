package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

var PlayCodeToMove = map[string]string{
	"A": "ROCK",
	"B": "PAPER",
	"C": "SCISSORS",
	"X": "ROCK",
	"Y": "PAPER",
	"Z": "SCISSORS",
}

var MoveToValue = map[string]int{
	"ROCK":     1,
	"PAPER":    2,
	"SCISSORS": 3,
}

var WinAgainst = map[string]string{
	"ROCK":     "PAPER",
	"PAPER":    "SCISSORS",
	"SCISSORS": "ROCK",
}

var LoseTo = map[string]string{
	"ROCK":     "SCISSORS",
	"PAPER":    "ROCK",
	"SCISSORS": "PAPER",
}

const LOSE_POINTS = 0
const DRAW_POINTS = 3
const WIN_POINTS = 6

func scoreRound(opponent string, self string) int {
	score := MoveToValue[self]
	if opponent == self {
		return score + DRAW_POINTS
	}
	if self == LoseTo[opponent] {
		return score + LOSE_POINTS
	}
	if self == WinAgainst[opponent] {
		return score + WIN_POINTS
	}
	// All possible returns have been covered for valid inputs
	return -1
}

func part1(data [][]string) {
	score := 0
	for _, round := range data {
		opponent := PlayCodeToMove[round[0]]
		self := PlayCodeToMove[round[1]]
		score += scoreRound(opponent, self)
	}
	fmt.Println("Part 1:")
	fmt.Println(score)
}

func loseRound(opponent string) int {
	return scoreRound(opponent, LoseTo[opponent])
}

func drawRound(opponent string) int {
	return scoreRound(opponent, opponent)
}

func winRound(opponent string) int {
	return scoreRound(opponent, WinAgainst[opponent])
}

func part2(data [][]string) {
	score := 0
	roundDirective := map[string]func(string) int{
		"X": loseRound,
		"Y": drawRound,
		"Z": winRound,
	}
	for _, round := range data {
		opponent := PlayCodeToMove[round[0]]
		directive := round[1]
		score += roundDirective[directive](opponent)
	}
	fmt.Println("Part 2:")
	fmt.Println(score)
}

func getData() ([][]string, error) {
	file, err := os.Open("day2.txt")
	if err != nil {
		return [][]string{}, err
	}
	defer file.Close()

	var lines [][]string

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		lines = append(lines, strings.Split(line, " "))
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading file:", err)
		return [][]string{}, err
	}

	return lines, nil
}

func main() {
	data, err := getData()
	if err != nil {
		fmt.Println(err)
		return
	}
	part1(data)
	part2(data)
}

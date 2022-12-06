package main

import (
	"bufio"
	"fmt"
	"os"
)

func printTopOfStacks(stacks [][]string) {
	for _, stack := range stacks {
		if len(stack) > 0 {
			fmt.Print(stack[0])
		} else {
			fmt.Print(" ")
		}
	}
	fmt.Println()
}

func part1(stacks [][]string, directives [][]int) {
	fmt.Println("Part 1:")
	for _, directive := range directives {
		stacks = moveStacks(stacks, directive, true)
	}
	printTopOfStacks(stacks)
}

func part2(stacks [][]string, directives [][]int) {
	fmt.Println("Part 2:")
	for _, directive := range directives {
		stacks = moveStacks(stacks, directive, false)
	}
	printTopOfStacks(stacks)
}

func moveStacks(stacks [][]string, directive []int, invertWhileMoving bool) [][]string {
	quantity := directive[0]
	from := directive[1]
	to := directive[2]

	moving := stacks[from][:quantity]
	stacks[from] = stacks[from][quantity:]

	var movedTo []string
	if invertWhileMoving {
		for j := len(moving) - 1; j > -1; j-- {
			movedTo = append(movedTo, moving[j])
		}
	} else {
		movedTo = append(movedTo, moving...)
	}
	movedTo = append(movedTo, stacks[to]...)
	stacks[to] = movedTo

	return stacks
}

func addStackItemsFromLine(stacks [][]string, input string) [][]string {
	// Line like "[Q]         [N]             [N]    "
	for i := 0; i < len(input); i += 4 {
		char := input[i+1 : i+2]
		stackI := i / 4
		if stackI < len(stacks) {
			if char != " " {
				stacks[stackI] = append(stacks[stackI], char)
			}
		} else {
			if char != " " {
				stacks = append(stacks, []string{char})
			} else {
				stacks = append(stacks, make([]string, 0))
			}
		}
	}
	return stacks
}

func getDirectiveFromLine(input string) []int {
	var quantity, fromStack, toStack int
	_, err := fmt.Sscanf(input, "move %d from %d to %d", &quantity, &fromStack, &toStack)
	if err != nil {
		panic("Issue parsing input line")
	}
	return []int{quantity, fromStack - 1, toStack - 1}
}

func getData() ([][]string, [][]int, error) {
	var stacks [][]string
	var directives [][]int

	file, err := os.Open("day5.txt")
	if err != nil {
		return stacks, directives, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		ignoreLine := line == "" || line[:2] == " 1"
		if !ignoreLine && line[:4] == "move" {
			directives = append(directives, getDirectiveFromLine(line))
		} else if !ignoreLine {
			stacks = addStackItemsFromLine(stacks, line)
		}
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading file:", err)
		return stacks, directives, err
	}

	return stacks, directives, nil
}

func main() {
	stacks, directives, err := getData()
	if err != nil {
		fmt.Println(err)
		return
	}
	part1(stacks, directives)
	// Stacks was mutated, so get it again
	// to refresh before part 2
	stacks, directives, err = getData()
	if err != nil {
		fmt.Println(err)
		return
	}
	part2(stacks, directives)
}

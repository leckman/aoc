package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
)

func positionToKey(position []int) string {
	return fmt.Sprintf("(%d,%d)", position[0], position[1])
}

func part1(directions []string) {
	fmt.Println("Part 1:")
	head := []int{0, 0}
	tail := []int{0, 0}
	visited := make(map[string]struct{})

	for _, l := range directions {
		direction, steps := parseDirective(l)
		for s := 0; s < steps; s++ {
			head = moveHead(direction, head)
			tail = moveTail(head, tail)
			visited[positionToKey(tail)] = struct{}{}
		}
	}

	fmt.Println(len(visited))
}

func part2(directions []string) {
	fmt.Println("Part 2:")
	knots := make([][]int, 10)
	for k := range knots {
		knots[k] = []int{0, 0}
	}
	visited := make(map[string]struct{})

	for _, l := range directions {
		direction, steps := parseDirective(l)
		for s := 0; s < steps; s++ {
			knots[0] = moveHead(direction, knots[0])
			for k := 1; k < len(knots); k++ {
				knots[k] = moveTail(knots[k-1], knots[k])
			}
			tail := knots[len(knots)-1]
			visited[positionToKey(tail)] = struct{}{}
		}
	}
	fmt.Println(len(visited))
}

func withinOneSpace(a int, b int) bool {
	return math.Abs(float64(a-b)) < 2
}

func isAdjacent(head []int, tail []int) bool {
	return withinOneSpace(head[0], tail[0]) && withinOneSpace(head[1], tail[1])
}

func moveUp(position []int) []int {
	position[0] -= 1
	return position
}

func moveDown(position []int) []int {
	position[0] += 1
	return position
}

func moveLeft(position []int) []int {
	position[1] -= 1
	return position
}

func moveRight(position []int) []int {
	position[1] += 1
	return position
}

func moveTail(head []int, tail []int) []int {
	if isAdjacent(head, tail) {
		return tail
	}
	// Below
	if tail[0] > head[0] {
		tail = moveUp(tail)
	}
	// Above
	if tail[0] < head[0] {
		tail = moveDown(tail)
	}
	// Left
	if tail[1] < head[1] {
		tail = moveRight(tail)
	}
	// Right
	if tail[1] > head[1] {
		tail = moveLeft(tail)
	}
	return tail
}

func moveHead(direction string, head []int) []int {
	switch direction {
	case "D":
		return moveDown(head)
	case "U":
		return moveUp(head)
	case "L":
		return moveLeft(head)
	case "R":
		return moveRight(head)
	default:
		fmt.Println(direction)
		panic("Unknown direction")
	}
}

func parseDirective(l string) (string, int) {
	var direction string
	var steps int
	_, err := fmt.Sscanf(l, "%s %d", &direction, &steps)
	if err != nil {
		fmt.Println(l)
		panic("Could not parse directive")
	}
	return direction, steps
}

func getData() ([]string, error) {
	var lines []string

	file, err := os.Open("day9.txt")
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
	part1(data)
	part2(data)
}

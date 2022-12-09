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
			if !isAdjacent(head, tail) {
				tail = moveTail(head, tail)
			}
			visited[positionToKey(tail)] = struct{}{}
		}
	}

	fmt.Println(len(visited))
}

func part2(directions []string) {
	fmt.Println("Part 1:")
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
				if !isAdjacent(knots[k-1], knots[k]) {
					knots[k] = moveTail(knots[k-1], knots[k])
				}
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

func moveTail(head []int, tail []int) []int {
	below := head[0] + 1
	above := head[0] - 1
	left := head[1] - 1
	right := head[1] + 1

	isVerticallyClose := withinOneSpace(head[0], tail[0])
	isBelow := tail[0] > head[0]
	if tail[1] < left {
		// D
		// T d . .
		// T t H .
		// T d . .
		// D
		if isVerticallyClose {
			return []int{head[0], left}
		} else if isBelow {
			return []int{below, left}
		} else {
			return []int{above, left}
		}
	}
	if tail[1] > right {
		//        D
		//  . . d T
		//  . H t T
		//  . . d T
		//        D
		if isVerticallyClose {
			return []int{head[0], right}
		} else if isBelow {
			return []int{below, right}
		} else {
			return []int{above, right}
		}
	}
	if isBelow {
		//  . H .
		//  . t .
		//  T T T
		return []int{below, head[1]}
	}
	// Leftover case: above & horizontally close
	//  T T T
	//  . t .
	//  . H .
	return []int{above, head[1]}
}

func moveHead(direction string, head []int) []int {
	switch direction {
	case "D":
		head[0] += 1
	case "U":
		head[0] -= 1
	case "L":
		head[1] -= 1
	case "R":
		head[1] += 1
	default:
		fmt.Println(direction)
		panic("Unknown direction")
	}
	return head
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

import { shallowMount, mount } from "@vue/test-utils";
import { flagAllMines, winGame } from "../specHelpers";
import Board from "@/components/Board.vue";
import Cell from "@/components/Cell.vue";

describe("Board", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Board);
  });

  it("defaults to 4x4 and 5 mines", () => {
    // Testing rendered output.  Treat Board like a blackbox.
    expect(wrapper.findAll(".row").length).toEqual(4);
    expect(wrapper.findAll(".col").length).toEqual(16);

    // Testing state directly.  Antipattern?
    expect(wrapper.vm.rows).toEqual(4);
    expect(wrapper.vm.cols).toEqual(4);
    expect(wrapper.vm.mines).toEqual(5);
  });

  it("rejects generateBoard if board is invalid.", () => {
    expect(wrapper.vm.generateBoard(0, 0, -1)).toEqual(false);
  });

  it("Rejects 0 rows", () => {
    const resetRowsInput = wrapper.find("input[name='reset-rows']");
    resetRowsInput.setValue("0");
    expect(wrapper.vm.errors.length >= 1).toEqual(true);
  });

  it("Rejects isNaN rows", () => {
    const resetRowsInput = wrapper.find("input[name='reset-rows']");
    resetRowsInput.setValue("asdf");
    expect(wrapper.vm.errors.length >= 1).toEqual(true);
  });

  it("Rejects invalid number of Columns", () => {
    const resetColsInput = wrapper.find("input[name='reset-cols']");
    resetColsInput.setValue(`-1`);

    // Test rendered output
    const errors = wrapper.findAll(".errors li");
    expect(errors.length >= 1).toEqual(true);

    // Test vm state
    expect(wrapper.vm.errors.length >= 1).toEqual(true);
  });

  it("Rejects invalid number of mines", () => {
    const newMinesInput = wrapper.find("input[name='reset-mines']");
    // Default board is 4x4 = 16 cells, so 17 mines in 16 cells in invalid.
    newMinesInput.setValue("17");
    expect(wrapper.vm.errors.length >= 1).toEqual(true);
  });

  it("provides a button to reset the game", () => {
    const resetBtn = wrapper.find(".reset-container button");
    // Initial state
    expect(wrapper.findAll(".row").length).toEqual(4);
    expect(wrapper.findAll(".col").length).toEqual(16);

    // Set new values
    wrapper.find("input[name='reset-rows']").setValue("3");
    wrapper.find("input[name='reset-cols']").setValue("3");
    resetBtn.trigger("click");

    expect(wrapper.findAll(".row").length).toEqual(3);
    expect(wrapper.findAll(".col").length).toEqual(9);
  });

  it("will not reset if errors are present", () => {
    expect(wrapper.findAll(".row").length).toEqual(4);
    wrapper.find("input[name='reset-rows']").setValue("0");
    wrapper.find(".reset-container button").trigger("click");
    expect(wrapper.findAll(".row").length).toEqual(4);
  });

  // Endgame Scenarios
  it("[Lose] click a mine", () => {
    wrapper.vm.board[0][0].mine = true;
    const cell = wrapper.find(Cell);
    cell.vm.$emit("cell-clicked", 0, 0, false);

    // State
    expect(wrapper.vm.youLost).toEqual(true);
    expect(wrapper.vm.gameActive).toEqual(false);

    // Rendered output
    expect(wrapper.find(".you-lost-container").exists()).toEqual(true);
  });

  it("passes a handleClick callback to Cell", () => {
    const spy = jest.spyOn(Board.methods, "handleClick");
    let wrapper = shallowMount(Board);
    const cell = wrapper.find(Cell);
    cell.vm.$emit("cell-clicked", 0, 1, false);
    expect(spy).toHaveBeenCalledWith(0, 1, false);
  });

  it("can flag a cell", () => {
    wrapper = shallowMount(Board);
    const cell = wrapper.find(Cell);
    expect(wrapper.vm.board[0][0].flag).toEqual(false);
    expect(wrapper.find(".flag").exists()).toEqual(false);
    cell.vm.$emit("cell-clicked", 0, 0, true);

    // Test state
    expect(wrapper.vm.board[0][0].flag).toEqual(true);
  });

  it("[Continue] All mines flagged, but one cell has not been clicked", () => {
    wrapper.vm.safeCells = 1;
    flagAllMines(wrapper);
    expect(wrapper.vm.gameWon()).toEqual(false);
  });

  it("can remove a flag", () => {
    wrapper = mount(Board);
    const cell = wrapper.find(Cell);
    expect(wrapper.find(".flag").exists()).toEqual(false);
    wrapper.vm.board[0][0].flag = true;
    expect(wrapper.find(".flag").exists()).toEqual(true);
    cell.vm.$emit("cell-clicked", 0, 0, true);
    expect(wrapper.find(".flag").exists()).toEqual(false);
  });

  it("can replace a number with a flag", () => {
    wrapper = mount(Board);
    const cell = wrapper.find(Cell);
    expect(wrapper.find(".flag").exists()).toEqual(false);
    wrapper.vm.board[0][0].mine = false;
    wrapper.vm.board[0][0].active = false;
    cell.vm.$emit("cell-clicked", 0, 0, true);
    expect(wrapper.find(".flag").exists()).toEqual(true);
  });

  it("[Continue] All cells clicked, but one mine has not been flagged", () => {
    wrapper.vm.safeCells = 0;
    flagAllMines(wrapper);
    wrapper.vm.board[0][0].mine = true;
    wrapper.vm.board[0][0].flag = false;
    expect(wrapper.vm.gameWon()).toEqual(false);
  });

  it("[Winning] All mines have been flagged and other cells clicked", () => {
    wrapper.vm.safeCells = 0;
    flagAllMines(wrapper);
    expect(wrapper.vm.gameWon()).toEqual(true);
  });

  it("Activates the 'High Scores' modal when a player wins", () => {
    expect(wrapper.vm.showHighScoresModal).toEqual(false);
    winGame(wrapper);
    expect(wrapper.vm.showHighScoresModal).toEqual(false);
  });
});

<template>
  <div class="reset-container">
    <div class="errors-container">
      <ul class="errors">
        <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
      </ul>
    </div>

    <div class="form-inputs-container">
      <!-- Rows -->
      <label for="rows">Rows</label>
      <input v-model="resetRows" name="reset-rows" type="text" />

      <!-- Columns -->
      <label for="cols">Columns</label>
      <input v-model="resetCols" name="reset-cols" type="text" />

      <!-- Mines -->
      <label for="mines">Mines</label>
      <input v-model="resetMines" name="reset-mines" type="text" />
    </div>

    <button class="reset-button" @click="handleClick">Reset</button>
  </div>
</template>

<script>
export default {
  name: "Reset",

  props: {
    errors: {
      type: Array,
      default: () => []
    },
    resetBoard: {
      type: Function,
      default: () => {}
    },
    validBoard: {
      type: Function,
      default: () => {}
    }
  },

  data: () => {
    return {
      resetRows: 4,
      resetCols: 4,
      resetMines: 5
    };
  },

  watch: {
    resetRows: function(newRows) {
      this.validBoard(newRows, this.resetCols, this.resetMines);
    },

    resetCols: function(newCols) {
      this.validBoard(this.resetRows, newCols, this.resetMines);
    },

    resetMines: function(newMines) {
      this.validBoard(this.resetRows, this.resetCols, newMines);
    }
  },

  methods: {
    handleClick() {
      this.resetBoard(this.resetRows, this.resetCols, this.resetMines);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/reset";

.reset-container {
  padding: 5% 0 10%;
  border: 1px solid #ccc;

  .errors-container {
    ul {
      padding: 0 10%;
    }

    li {
      text-align: center;
      color: maroon;
    }
  }

  button.reset-button {
    width: 90%;
  }

  input {
    border: 1px solid #ccc;
  }
}

@media screen and (max-width: 500px) {
  .reset-container {
    border: none;
    display: flex;
    flex-direction: column-reverse;
  }

  button.reset-button {
    margin: 0 auto 35px;
    width: 65%;
    height: 40px;
  }
}
</style>

<template>
  <th :class="order" @click="handleClick">
    <slot></slot>
  </th>
</template>

<script>
  export default {
    name: 'SortableHeader',
    props: ['order', 'column'],
    methods: {
      handleClick() {
        this.$emit('sort', this.column);
      }
    }
  }
</script>

<style scoped>
  th {
    cursor: pointer;
    position: relative;
    padding-right: 10px;
  }

  th:after {
    content: ' ';
    position: absolute;
    height: 0;
    width: 0;
    right: 5px; /* (right padding / 2) - arrow width */
    top: 16px; /* ((padding * 2) + line height) - arrow height */
    /** As pointed out by Dave Everitt in 
     * https://css-tricks.com/snippets/css/css-triangle/
     * The arrow is not an equilateral triangle.
     * the height is 86.6% of the width.
     * Notice the above code does not subract the border 
     * width exactly. It is subtracting
     * (rounded) border width * 86.6%
     **/
  }

  /* Default sortable indicator */
  th:after {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #ccc;
    border-bottom: 0px solid transparent;
  }
  /* !Default */

  /* Default sortable indicator:hover */
  th:hover:after {
    border-top: 5px solid #888;
  }
  /* !Default:hover */

  /* Ascending sortable indicator */
  th.asc:after {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 0px solid transparent;
    border-bottom: 5px solid #333;
  }
  th.asc:hover:after {
    border-bottom: 5px solid #888;
  }
  /* !Ascending */

  /* Descending sortable indicator */
  th.desc:after {    
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #333;
    border-bottom: 5px solid transparent;
  }
  /* !Descending */
</style>
<script setup>
  
</script>

<template>
    <div class="basetrade">
    <h1> Base and Transaction information </h1>
        <table>
  <thead>
    <tr>
      <th>Collection Point</th>
      <th>Associated Transaction Points</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Collection Point A</td>
      <td>
        <ul>
          <li>Transaction Point 1</li>
          <li>Transaction Point 2</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Collection Point B</td>
      <td>
        <ul>
          <li>Transaction Point 2</li>
          <li>Transaction Point 3</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>
    </div>
    <!-- 
    -->
</template>

<style scoped>
    body {
      font-family: Arial, sans-serif;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    th {
      background-color: #f2f2f2;
    }
</style>
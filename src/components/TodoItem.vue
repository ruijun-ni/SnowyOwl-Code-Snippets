<template>
    <div class="todo-item">
        <div class="todo-item-note">
            <input aria-label="check" :id="item.id" type="checkbox" @change="toggleComplete" :checked="item.checked" />
            <!-- if the to-do item is too long to display, show a preview limited to one line -->
            <router-link :to="{ name: 'oneWord', params: { id: item.id }}">
                {{ item.note.length > 20 ? item.note.substring(0, 20) + '...' : item.note }}
            </router-link>
            <!-- <button @click="deleteTodo">✗</button> -->
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    methods: {
        deleteTodo: function() {
            this.$emit('deleteTodo', this.item.id)
        },
        toggleComplete: function() {
            this.$emit('toggleComplete', this.item.id)
        }
    }
}
</script>
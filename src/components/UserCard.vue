<script lang="ts" setup>
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { User } from '@/services/users/types'
import { computed, ref } from 'vue';

import { Loader, Trash2, Undo2 } from 'lucide-vue-next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from '@/components/ui/button'

import { API } from '@/services';
import { useUsersStore } from '@/stores/users';

const props = defineProps<{
  user: User
}>()

const dialogIsOpen = ref(false)
const deleteLoading = ref(false) 
const userStore = useUsersStore()

async function deleteUser() {
  try {
    deleteLoading.value = true
    await API.users.deleteUser(props.user.uname)
    userStore.fetchUsers()
    dialogIsOpen.value = false
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

const jobTitle = computed(() => {
  switch (props.user.uperm) {
    case 1:
      return 'Разработчик'
    case 2:
      return 'Администратор'
    case 3:
      return 'Суперпользователь'
  }
})

</script>

<template>
  <Dialog :open="dialogIsOpen" @update:open="dialogIsOpen = $event">
    <DialogTrigger as-child>
      <div
        @click="dialogIsOpen = true"
        class="grid grid-cols-6 select-none relative group cursor-pointer transition-all duration-150 hover:bg-orange-900/20 outline outline-transparent hover:outline-primary items-center gap-4 col-span-1 bg-elevated shadow-elevated-lg pl-4 rounded-default"
      >
        <div class="col-span-4 flex py-4 flex-col">
          <div class="flex flex-col gap-1 items-baseline">
            <p class="text-white">{{ user.uname }}</p>
            <p class="text-xs text-muted-foreground">
              {{ user.ulastname }} {{ user.ufirstname[0] }}.
            </p>
          </div>
        </div>
        <Avatar
          class="h-full shadow-elevated rounded-br-default col-span-2 w-full rounded-tl-4xl rounded-bl-4xl bg-elevated-lg rounded-tr-default transition-all duration-150"
        >
          <AvatarImage alt="@unovue" src="https://github.com/sdsdunovue.png" />
          <AvatarFallback
            class="group-hover:bg-orange-800/20 transition-all duration-150 rounded-br-default rounded-tl-4xl rounded-bl-4xl bg-elevated-lg rounded-tr-default"
          >
            {{ user.ufirstname[0] }}{{ user.ulastname[0] }}
          </AvatarFallback>
        </Avatar>
      </div>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="gap-1">
        <DialogTitle>
          <div class="w-full pb-2 items-center justify-between flex flex-row gap-4">
            <div class="flex flex-row gap-2 items-baseline">
              <p class="text-xs text-muted-foreground uppercase">{{ jobTitle }}</p>
              <p>{{ user.uname }}</p>
            </div>
          </div>
        </DialogTitle>
        <DialogDescription class="flex flex-col gap-2">

          <div class="flex flex-row gap-2">
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button
                  class="flex w-full hover:bg-red-900/20 hover:outline-red-500 flex-row gap-2"
                  :class="{ 'shine-btn pointer-events-none': deleteLoading }"
                  size="lg"
                  variant="outline"
                >
                  <Loader v-if="deleteLoading" class="animate-spin" />
                  <Trash2 v-else />
                  <p>Удалить пользователя</p>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Вы уверны, что хотите удалить пользователя?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Данное действие невозможно отменить. Это удалит пользователя
                    <b class="text-white">{{ user.uname }}</b> и все связанные с ним данные
                    навсегда.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel as-child>
                    <Button class="flex flex-row gap-2" size="lg" variant="outline">
                      <Undo2 />
                      <p>Отменить</p>
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogAction as-child
                    ><Button
                      @click="deleteUser"
                      class="flex hover:bg-red-900/20 hover:outline-red-500 flex-row gap-2"
                      size="lg"
                      variant="outline"
                    >
                      <Trash2 />
                      <p>Удалить пользователя</p>
                    </Button></AlertDialogAction
                  >
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>

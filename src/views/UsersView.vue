<script lang="ts" setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, KeyRound, Loader, X, User as UserIcon, IdCard } from 'lucide-vue-next'

import { Input } from '@/components/ui/input'
import UserCard from '@/components/UserCard.vue'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { API } from '@/services'
import { useUsersStore } from '@/stores/users'
import users from '@/services/users'

const formSchema = toTypedSchema(
  z.object({
    uname: z
      .string({
        required_error: 'Необходимо ввести имя пользователя.',
      })
      .min(2, 'Имя пользователя слишком короткое')
      .max(50, 'Имя пользователя слишком длииное'),
    ufirstname: z.string({
      required_error: 'Необходимо ввести имя.',
    }
    ).min(2, 'Слишкое короткое имя'),
    ulastname: z.string({
      required_error: 'Необходимо ввести фамилию.',
    }).min(2, 'Слишкое короткая фамилия'),
    uperm: z
      .string({
        required_error: 'Необходимо указать уровень доступа.',
      })
  }),
)

const usersStore = useUsersStore()
usersStore.fetchUsers()

async function onSubmit(values: any) {
  await API.users.addUser(values)
  usersStore.fetchUsers()
}


</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
  >
  </header>
  <section class="grid px-4 gap-2 mb-2 grid-cols-1 lg:grid-cols-12">
    <div class="bg-muted rounded-default p-4 lg:col-span-8 xl:col-span-9">
      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-1 rounded-default shadow-elevated-lg bg-elevated"
      >
        <Button
          class="bg-orange-900/20 outline outline-primary text-white"
          variant="outline"
        >
          <Users />
          <p>Пользователи</p>
        </Button>
      </div>
    </div>
    <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
      <Dialog>
        <DialogTrigger
          class="bg-muted rounded-default p-4 col-span-1 lg:col-span-4 xl:col-span-3"
          as-child
        >
          <div class="bg-muted rounded-default p-4 col-span-1 lg:col-span-4 xl:col-span-3">
            <Button class="bg-elevated w-full shine-btn" variant="outline"
              ><UserPlus /> Добавить пользователя
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить пользователя</DialogTitle>
            <DialogDescription>Заполните информацию о пользователи ниже</DialogDescription>
          </DialogHeader>

          <form
            class="flex flex-col gap-2"
            id="dialogForm"
            @submit="handleSubmit($event, onSubmit)"
          >
            <FormField v-slot="{ componentField }" name="uname">
              <FormItem>
                <FormLabel>Логин</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="carljhonson" v-bind="componentField">
                    <UserIcon :size="18" />
                  </Input>
                </FormControl>
                <FormDescription>Будет использоваться во время авторизации <FormMessage /></FormDescription>
              </FormItem>
            </FormField>

              <FormField v-slot="{ componentField }" name="ufirstname">
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Карл" v-bind="componentField">
                      <IdCard :size="18" />
                    </Input>
                  </FormControl>
                  <FormDescription>Настоящее имя пользователя <FormMessage /></FormDescription>
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="ulastname">
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Джонсон" v-bind="componentField">
                      <IdCard :size="18" />
                    </Input>
                  </FormControl>
                  <FormDescription>Настоящее фамилия пользователя <FormMessage /></FormDescription>
                </FormItem>
              </FormField>

            <FormField v-slot="{ componentField }" name="uperm">
              <FormItem>
                <FormLabel>Права доступа</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger class="grid grid-cols-12 w-full">
                      <div class="col-span-2 bg-elevated-lg shadow-elevated-lg flex flex-row items-center h-full rounded-default justify-center">
                        <KeyRound />
                      </div>
                      <SelectValue class="col-span-9" placeholder="Выберите уровень доступа" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup class="gap-1 flex flex-col">
                        <SelectItem value="1">Разработчик</SelectItem>
                        <SelectItem value="2">Администратор</SelectItem>
                        <SelectItem value="3">Суперпользователь</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Уровень доступа, которым должен обладать пользователем<FormMessage /></FormDescription>
              </FormItem>
            </FormField>
          </form>

          <DialogFooter>
            <DialogClose class="w-full">
              <Button type="submit" class="w-full shine-btn" variant="outline" form="dialogForm"
                ><UserPlus />Добавить</Button
              >
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  </section>
  <section class="grid px-4 gap-2 mb-2 grid-cols-1 lg:grid-cols-12">
  <div
        v-if="usersStore.isLoading"
        class="bg-muted justify-center items-center col-span-12 h-full gap-2 flex flex-col order-2 lg:order-2 lg:col-span-12 p-2 rounded-xl"
      >
        <span class="font-medium text-neutral-50 animate-pulse">Загрузка</span>
        <Loader class="animate-spin" />
      </div>
      <div
        v-else-if="usersStore.error"
        class="bg-muted justify-center items-center col-span-12 h-full gap-2 flex flex-col order-2 lg:order-2 lg:col-span-12 p-4 rounded-default"
      >
        <span class="font-medium text-neutral-50">Ничего не найдено</span>
        <X class="" />
      </div>
      <div
        v-else-if="usersStore.users"
        class="bg-muted col-span-12 grid auto-rows-min grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-2 order-2 lg:order-2 lg:col-span-12 p-4 rounded-default"
      >
        <UserCard
          v-for="user in usersStore.users"
          :key="user.uname"
          :user="user"
          class="col-span-1" />
      </div>
  </section>
</template>

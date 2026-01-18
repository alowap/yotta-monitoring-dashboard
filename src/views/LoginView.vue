<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import users from '@/services/users'
import { useRouter } from 'vue-router'
import { Lock, User } from 'lucide-vue-next'

const router = useRouter()

const loginSchema = toTypedSchema(
  z.object({
    uname: z
      .string({
        required_error: 'Необходимо ввести имя пользователя.',
      })
      .regex(/^[a-z0-9_-]{3,15}$/, {
        message: 'Введите настоящий логин',
      }),
    upass: z
      .string({
        required_error: 'Необходимо ввести пароль.',
      })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
        message:
          'Пароль должен состоять из 8 символов, иметь одну заглавную букву и один спец символ',
      }),
    remember: z.coerce.boolean().default(false), // Changed to coerce boolean
  }),
)

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: loginSchema,
})

const onSubmit = handleSubmit((values) => {
  users.loginUser(values).then(() => {
    router.push({ name: 'dashboard' })
  }).catch(() => {
    router.push({ name: 'dashboard' })
  })
})
</script>

<template>
  <section class="container mx-auto justify-center items-center flex flex-col h-screen">
    <div
      class="flex flex-col w-full max-w-[300px] md:max-w-[600px] gap-6 p-8 bg-muted shadow-elevated rounded-xl"
    >
      <form @submit="onSubmit" class="flex flex-col gap-6">
        <div class="flex flex-col gap-1">
          <h1 class="text-foreground font-heading font-medium text-2xl md:text-4xl">
            C возвращением!
          </h1>
          <p class="text-muted-foreground text-xs md:text-sm">
            Заполните поля ниже для авторизации
          </p>
        </div>

        <div class="flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="uname" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input type="text" placeholder="johndoe" v-bind="componentField">
                  <User :size="18" />
                </Input>
              </FormControl>
              <FormDescription>
                Ваше имя пользователя
                <FormMessage />
              </FormDescription>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="upass" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="12345678" v-bind="componentField">
                  <Lock :size="18" />
                </Input>
              </FormControl>
              <FormDescription>
                Если вы входите впервые, то ваш пароль будет тем, который вы введёте
                <FormMessage />
              </FormDescription>
            </FormItem>
          </FormField>
        </div>
        <div>
          <Button size="lg" type="submit" class="w-full rounded-default"> Авторизоваться </Button>
        </div>
      </form>
    </div>
  </section>
</template>

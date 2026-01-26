<script setup lang="ts">
import Button from "./button/Button.vue";
import { PackagePlus } from "lucide-vue-next";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from "vee-validate";

const props = defineProps<{
    hudText: string
}>()

const formSchema = toTypedSchema(z.object({
    nname: z.string({
        required_error: "Необходимо указать название ноды"
    }).min(2).max(50),
    ntype: z.string().min(2).max(50),
    hostid: z.string().min(2).max(64)
}))

const form = useForm({
    validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted!', values)
})

</script>

<template>
    <div class="absolute left-4 min-w-[200px] bottom-4 container-col-flex z-10">
        <Dialog>
            <DialogTrigger>
                <Button size="lg" variant="outline" class="w-full shine-btn">
                    <PackagePlus />
                    Добавить ноду
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавление доменов</DialogTitle>
                    <DialogDescription>
                        Заполните поля все необходимые поля ниже
                    </DialogDescription>
                </DialogHeader>
                <form @submit="onSubmit">
                    <div class="flex flex-col gap-3">
                        <FormField v-slot="{ componentField }" name="nname">
                            <FormItem>
                                <FormLabel>Название ноды</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Это название будет отображаться на карте"
                                        v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="ntype">
                            <FormItem>
                                <FormLabel>Выберите тип ноды</FormLabel>
                                <FormControl>
                                    <Select v-bind="componentField">
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Выберите тип ноды" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="camerat">
                                                Термальная камера
                                            </SelectItem>
                                            <SelectItem value="camera">
                                                Камера
                                            </SelectItem>
                                            <SelectItem value="router">
                                                Роутер
                                            </SelectItem>
                                            <SelectItem value="switch">
                                                Свитч
                                            </SelectItem>
                                            <SelectItem value="server">
                                                Сервер
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="hostid">
                            <FormItem>
                                <FormLabel>Выберите ноду в Zabbix</FormLabel>
                                <FormControl>
                                    <Select v-bind="componentField">
                                        <SelectTrigger class="w-full">
                                            <SelectValue placeholder="Выберите тип ноды" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="123">
                                                11_T_6
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <Button size="lg" variant="outline" class="w-full mt-4 shine-btn">
                        <PackagePlus />
                        Добавить ноду
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
        <div class="rounded-lg glassify border border-border px-2 py-1 text-xs">
            <p class="opacity-30 text-center">{{ props.hudText }}</p>
        </div>
    </div>
</template>
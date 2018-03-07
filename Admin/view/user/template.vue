<template>
    <Card shadow :bordered="false">
        <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
            <FormItem label="姓名" prop="name">
                <Input v-model="formData.name" placeholder="Enter your name" style="width:110px"></Input>
            </FormItem>
            <FormItem label="昵称" prop="nickname">
                <Input v-model="formData.nickname" placeholder="Enter your nickname" style="width:110px"></Input>
            </FormItem>
            <FormItem label="邮箱" prop="mail">
                <Input v-model="formData.mail" placeholder="Enter your e-mail" style="width:110px"></Input>
            </FormItem>
           
            <FormItem label="手机号" prop="phone">
                <Input v-model="formData.phone" placeholder="Enter your phone" style="width:110px"></Input>
            </FormItem>
            <FormItem label="City" prop="city">
                <Select v-model="formData.city" placeholder="Select your city">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                </Select>
            </FormItem>
            <FormItem label="Date">
                <Row>
                    <Col span="11">
                        <FormItem prop="date">
                            <DatePicker type="date" placeholder="Select date" v-model="formData.date"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <FormItem prop="time">
                            <TimePicker type="time" placeholder="Select time" v-model="formData.time"></TimePicker>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="Gender" prop="gender">
                <RadioGroup v-model="formData.gender">
                    <Radio label="male">Male</Radio>
                    <Radio label="female">Female</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="Hobby" prop="interest">
                <CheckboxGroup v-model="formData.interest">
                    <Checkbox label="Eat"></Checkbox>
                    <Checkbox label="Sleep"></Checkbox>
                    <Checkbox label="Run"></Checkbox>
                    <Checkbox label="Movie"></Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="Desc" prop="desc">
                <Input v-model="formData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formData')">Submit</Button>
                <Button type="ghost" @click="handleReset('formData')" style="margin-left: 8px">Reset</Button>
            </FormItem>
        </Form>
    </Card>
</template>
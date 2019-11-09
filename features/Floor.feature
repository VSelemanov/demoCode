# language: ru

Функционал: CRUD этажей

CRUD эатжей

Контекст:
Допустим сервер стартовал
И база данных пуста
И я создаю пользователя
И есть запись в таблице контактов
И есть проекты "проект1"
И у проекта "проект1" есть объекты "объект1"

# @new
Сценарий: Получить список этажей
Допустим я делаю запрос на создание этажа "этаж1" у объекта "объект1"
Когда я делаю запрос на получение этажей у объекта "объект1"
То сервер должен вернуть статус 200
И в ответе должен быть массив этажей с этажом "этаж1"
# @new
Сценарий: Создание новых этажей
Когда я делаю запрос на создание этажа "этаж1" у объекта "объект1"
То сервер должен вернуть статус 200
И в ответе должен быть массив этажей с этажом "этаж1"
# @new
Сценарий: Удаление этажей
Допустим я делаю запрос на создание этажа "этаж1" у объекта "объект1"
Когда я делаю запрос на удаление этажа "этаж1"
То сервер должен вернуть статус 200
И в таблице этажей нет этажа "этаж1"
# @new
Сценарий: Изменение этажей
Допустим я делаю запрос на создание этажа "этаж1" у объекта "объект1"
Когда я делаю запрос на изменение этажа "этаж1" на "новыйэтаж1"
То сервер должен вернуть статус 200
И в таблице этажей должен быть этаж "новыйэтаж1"

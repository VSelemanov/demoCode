# language: ru

Функционал: CRUD по ресурсу

CRUD по ресурсу

Контекст:
Допустим сервер стартовал
И база данных пуста
И я создаю пользователя
И я создаю тестовую единицу измерения
# @new
Сценарий: Создание ресурса
Когда я ввожу новый ресурс "ресурс1" в систему
И я ввожу новый ресурс "ресурс2" в систему
То сервер должен вернуть статус 200
И в ответе массив ресурсов с ресурсом "ресурс2" и полем "ResourceID" = 2
# @new
Сценарий: Получение списка ресурсов
Допустим я ввожу новый ресурс "ресурс1" в систему
И я ввожу новый ресурс "ресурс2" в систему с зависимостью от "ресурс1"
Когда я запрашиваю ресурсы системы "false"
То сервер должен вернуть статус 200
И в ответе должен быть массив ресурсов с ресурсами "ресурс1" и "ресурс2"
# @new
Сценарий: Получение дерева ресурсов
Допустим я ввожу новый ресурс "ресурс1" в систему
И я ввожу новый ресурс "ресурс2" в систему с зависимостью от "ресурс1"
Когда я запрашиваю ресурсы системы "true"
То сервер должен вернуть статус 200
И в ответе должен быть массив ресурсов с ресуром "ресурс1"
И у "ресурс1" есть дочерний элемент "ресурс2"
# @new
Сценарий: Получить список ресурсов с работами
Допустим я ввожу новый ресурс "ресурс1" в систему
И создаю новую работу "работа1" по ресурсу "ресурс1"
И создаю новую работу "работа2" по ресурсу "ресурс1"
Когда я делаю запрос на получение списка ресурсов с работами
То сервер должен вернуть статус 200
И в ответе должен быть массив ресурсов с ресурсом "ресурс1" у которого есть 2 работы
# @new
Сценарий: Удаление ресурсов
Допустим я ввожу новый ресурс "ресурс1" в систему
Когда я делаю запрос удаления ресурсов
То сервер должен вернуть статус 200
И список ресурсов должен быть пуст
# @new
Сценарий: Обновление ресурсов
Допустим я ввожу новый ресурс "ресурс1" в систему
Когда я делаю запрос обновления данных ресурса "ресурс1" на "новыйресурс1"
То сервер должен вернуть статус 200
И в ответе должен быть обновленный ресурс "новыйресурс1" с единицей измерения
# @new
Сценарий: Создание(пересоздание) связей между работами и ресурсом
Допустим я ввожу новый ресурс "ресурс1" в систему
И создаю новую работу "работа3" по ресурсу "ресурс1"
И создаю новую работу "работа1"
И создаю новую работу "работа2"
Когда я делаю запрос на создание связи между ресурсом "ресурс1" и работами "работа1,работа2"
То сервер должен вернуть статус 200
И я делаю запрос на получение списка ресурсов с работами
И в ответе должен быть массив ресурсов с ресурсом "ресурс1" у которого есть 2 работы
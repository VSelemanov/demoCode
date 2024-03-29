# language: ru

Функционал: CRUD по единицам измерения

CRUD по единицам измерения

Контекст:
Допустим сервер стартовал
И база данных пуста
И я создаю пользователя
# @new
Сценарий: Создание единицы измерения
Когда я создаю новую единицу измерения "тест"
То сервер должен вернуть статус 200
И в ответе новая единица измерения "тест"
# @new
Сценарий: Получения списка ресурсов
Когда я создаю новую единицу измерения "тест"
И я запрашиваю список единиц измерения системы
То сервер должен вернуть статус 200
И в ответе должен быть массив единиц измерения с единицей измерения "тест"
# @new
Сценарий: Удаление единиц измерения
Допустим я создаю новую единицу измерения "тест"
Когда я делаю запрос удаления единицы измерения "тест"
То сервер должен вернуть статус 200
И список единиц измерения должен быть пуст
# @new
Сценарий: Обновление единиц измерения
Допустим я создаю новую единицу измерения "тест"
Когда я делаю запрос обновления данных единицы измерения "тест" на "новыйтест"
То сервер должен вернуть статус 200
И в ответе должен быть массив с обновленной единицей измерения "новыйтест"

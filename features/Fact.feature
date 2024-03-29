# language: ru

Функционал: CRUD по факту

CRUD по факту

Контекст:
Допустим сервер стартовал
И база данных пуста
И я создаю тестовую единицу измерения
И я ввожу новый ресурс "ресурс1" в систему
И создаю новую работу "работа1" по ресурсу "ресурс1"
И создаю новую работу "работа2" по ресурсу "ресурс1"
И я создаю пользователя
И я создаю тестовый контакт
И я создаю тестовый проект
И я создаю тестовый объект с привязкой к проекту
И я создаю тестовую регистрацию с привязкой к объекту
И я создаю тестовый компонент с привязкой к регистрации


# И регистрация "Регистрация 1" привязана к ресурсу

# @new
Сценарий: Создание факта по компоненту
Когда я ввожу факт "false" с 3 фото по компоненту
То сервер должен вернуть статус 200
И в ответе новый факт
И в таблице фото факта появились 3 записи
# @new
Сценарий: Получения списка фактов
Допустим я ввожу факт "false" с 3 фото по компоненту
И я ввожу факт "true" с 3 фото по компоненту
И запрашиваю список фактов по компоненту
То сервер должен вернуть статус 200
И в ответе должен быть объект с двумя свойствами-массивами "JobFacts" и "ResourceFacts"
# @new
Сценарий: Обновления факта: введение оценки и комментария
Допустим я ввожу факт "false" с 3 фото по компоненту
Когда я оставляю комментарий к факту и ставлю оценку
То сервер должен вернуть статус 200
И в ответе массив фактов с фактом у которого есть комментарий и оценка

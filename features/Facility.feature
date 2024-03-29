            # language: ru

            Функционал: Получение списка Объектов

            Как результат - дерево конструктивов или список объектов

            Контекст:
            Допустим сервер стартовал
            И база данных пуста
            И я создаю пользователя

            И есть запись в таблице контактов
            И есть проекты "проект1, проект2"
            И у проекта "проект1" есть объекты "объект11, объект12"
            И у проекта "проект2" есть объекты "объект21, объект22"

            И я создаю тестовую единицу измерения

            И я ввожу новый ресурс "ресурс1" в систему
            И создаю новую работу "работа1" по ресурсу "ресурс1"
            И создаю новую работу "работа2" по ресурсу "ресурс1"

            И в объекте "объект12" есть следующие элементы:
            | type     | guid                                 | name                    | FloorGUID                            |  |
            | Floor    | 6756e099-f899-4533-a546-db24a3516d30 | Этаж 1              |                                      |  |
            | Floor    | 6756e099-f899-4533-a546-db24a3516d31 | Этаж 2              |                                      |  |
            | Space    | 6756e099-f899-4533-a546-db24a3516d32 | Комната11        | 6756e099-f899-4533-a546-db24a3516d30 |  |
            | Space    | 6756e099-f899-4533-a546-db24a3516d33 | Комната12        | 6756e099-f899-4533-a546-db24a3516d30 |  |
            | Register | 6756e099-f899-4533-a546-db24a3516d34 | Регистрация1 |                                      |  |

            И регистрация "Регистрация1" привязана к ресурсу

            И в объекте "объект12" есть следующие системы:
            | guid                                 | name            | FloorGUID                            | SpaceGUID                            |
            | 6756e099-f899-4533-a546-db24a3516d35 | Система1 | 6756e099-f899-4533-a546-db24a3516d30 |                                      |
            | 6756e099-f899-4533-a546-db24a3516d36 | Система2 | 6756e099-f899-4533-a546-db24a3516d31 |                                      |
            | 6756e099-f899-4533-a546-db24a3516d37 | Система3 |                                      | 6756e099-f899-4533-a546-db24a3516d32 |
            | 6756e099-f899-4533-a546-db24a3516d38 | Система4 |                                      | 6756e099-f899-4533-a546-db24a3516d33 |

            И в объекте "объект12" есть следующие компоненты:
            | name | FloorGUID                            | SpaceGUID                            | SystemGUID                           | RegisterGUID                         |
            | 1    | 6756e099-f899-4533-a546-db24a3516d30 |                                      |                                      | 6756e099-f899-4533-a546-db24a3516d34 |
            | 2    | 6756e099-f899-4533-a546-db24a3516d31 |                                      |                                      | 6756e099-f899-4533-a546-db24a3516d34 |
            | 3    |                                      | 6756e099-f899-4533-a546-db24a3516d32 |                                      | 6756e099-f899-4533-a546-db24a3516d34 |
            | 4    |                                      | 6756e099-f899-4533-a546-db24a3516d33 |                                      | 6756e099-f899-4533-a546-db24a3516d34 |
            | 5    |                                      |                                      | 6756e099-f899-4533-a546-db24a3516d35 | 6756e099-f899-4533-a546-db24a3516d34 |
            | 6    |                                      |                                      | 6756e099-f899-4533-a546-db24a3516d36 | 6756e099-f899-4533-a546-db24a3516d34 |
            | 7    |                                      |                                      | 6756e099-f899-4533-a546-db24a3516d37 | 6756e099-f899-4533-a546-db24a3516d34 |
            | 8    |                                      |                                      | 6756e099-f899-4533-a546-db24a3516d38 | 6756e099-f899-4533-a546-db24a3516d34 |





Сценарий: Получить список объектов
Когда я делаю запрос списка объектов проекта "проект1"
То сервер должен вернуть статус 200
И в ответе должен быть массив с объектами "объект11, объект12"

Сценарий: Получить список всех объектов
Когда я делаю запрос списка всех объектов
То сервер должен вернуть статус 200
И в ответе должен быть массив с объектами "объект11, объект12"
# @new
Сценарий: Получить объект с иерархией
Когда я делаю запрос по объекту "объект12"
То сервер должен вернуть статус 200
И в ответе должен быть объект с этажами с компонентами с регистрацией, ресурсами и работами и системами
И в этаже "Этаж 1" должны быть помещения с компонентами с регистрацией, ресурсами и работами и системами
И в объекте должна быть галерея фотографий
# @new
Сценарий: Создание новых объектов
Допустим я делаю запрос на создание проекта "проект1"
Когда я делаю запрос на создание объектов "объект1" для проекта "проект1"
То сервер должен вернуть статус 200
И в ответе должен быть массив объектов с объектом "объект1"
# @new
Сценарий: Создание нового объекта (formdata)
Допустим я делаю запрос на создание проекта "проект1"
Когда я делаю запрос на создание объекта с галереей из 3 фото "объект1" для проекта "проект1"
То сервер должен вернуть статус 200
И в ответе должен быть массив объектов с объектом "объект1"
И в объекте "объект1" должна быть картинка
И в объекте "объект1" должна быть галерея из 3 картинок
# @new
Сценарий: Удаление объектов
Допустим я делаю запрос на создание проекта "проект1"
И я делаю запрос на создание объектов "объект1" для проекта "проект1"
Когда я делаю запрос на удаление объекта "объект1"
То сервер должен вернуть статус 200
И в таблице объектов нет объекта "объект1"
# @new
Сценарий: Изменение объектов
Допустим я делаю запрос на создание проекта "проект1"
И я делаю запрос на создание объекта "объект1" для проекта "проект1"
Когда я делаю запрос на изменение объекта "объект1" на "новыйобъект1"
То сервер должен вернуть статус 200
И в таблице объектов должен быть объект "новыйобъект1"
# @new
Сценарий: Изменение объекта (formdata)
Допустим я делаю запрос на создание проектов "проект1"
И я делаю запрос на создание объектов "объект1" для проекта "проект1"
Когда я делаю запрос на изменение объекта "объект1" на "новыйобъект1" с картинкой
То сервер должен вернуть статус 200
И в ответе должен быть массив объектов с объектом "новыйобъект1"
И в объекте "новыйобъект1" должна быть картинка
# @new
Сценарий: Изменение объекта (formdata) с галереей
Допустим я делаю запрос на создание проектов "проект1"
И я делаю запрос на создание объектов "объект1" для проекта "проект1"
Когда я делаю запрос на изменение объекта "объект1" на "новыйобъект1" с картинкой и галереей из 3 фото
То сервер должен вернуть статус 200
И в ответе должен быть массив объектов с объектом "новыйобъект1"
И в объекте "новыйобъект1" должна быть картинка
И в объекте "новыйобъект1" должна быть галерея из 3 картинок
# @new
Сценарий: Получить отчет динамики факта в объекте
И я ввожу факт "false" с 3 фото по компоненту
И я ввожу факт "false" с 3 фото по компоненту
И я ввожу факт "false" с 3 фото по компоненту
И я ввожу факт "false" с 3 фото по компоненту
Когда я делаю запрос на получение динамики факта для объекта "объект12"
То сервер должен вернуть статус 200

# @new
Сценарий: Получить список объектов для админа с поисковой строкой
Когда админ делает запрос на получение списка объектов с поиском "12"
То сервер должен вернуть статус 200
И в ответе должен быть массив с 1 объектом "объект12"

# @new
Сценарий: Получить список объектов для админа с поисковой строкой
Когда админ делает запрос на получение списка объектов с поиском "undefined"
То сервер должен вернуть статус 200
И в ответе должен быть массив с 4 объектами
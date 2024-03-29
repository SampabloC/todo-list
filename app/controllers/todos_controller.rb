class TodosController < ApplicationController
  def index
    todo = Todo.order("created_at DESC")
    render json: todo
  end

  def create
    todo = Todo.create(todo_params)
    render json: todo
  end

  def update
    todo = Todo.find(params[:id])
    todo.update(todo_params)
    render json: todo
  end

  def destroy
    todo = Todo.find(params[:id])
    todo.destroy
    head :no_content, status: :ok
  end

  private
    def todo_params
      params.require(:todo).permit(:title, :done)
    end
end

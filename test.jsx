import React from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import { Modal, SimpleModal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import ClearIcon from "@material-ui/icons/Clear";
import "./index.css";
import { useState } from "react";
import { ListItemText, ListItemAvatar, Avatar } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
OrderList.propTypes = {};

const orderStatus = {
	0: {
		lableCss: "label label-info",
		content: "Chờ xác nhận",
	},
	1: {
		lableCss: "label label-process",
		content: "Đang giao hàng",
	},
	2: {
		lableCss: "label label-success",
		content: "Hoàn thành",
	},
	3: {
		lableCss: "label label-danger",
		content: "Đã hủy",
	},
};

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 800,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function OrderList(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [idOrder, setIdOrder] = useState("");
	const [openModal, setOpenModal] = React.useState(false);
	const [modalStyle] = React.useState(getModalStyle);
	const [orderItem, setOrderItem] = useState({});
	const handleOpenModal = (value) => {
		setOrderItem(value);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleClickOpen = (id) => {
		setIdOrder(id);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleClick = () => {
		if (props.cancel) {
			props.cancel(idOrder);
		}
		setOpen(false);
	};
	const body = (order) => (
		<div style={modalStyle} className={classes.paper}>
			<article class="card">
				<header class="card-header"> My Orders / Tracking </header>
				<div class="card-body">
					<h6 className="orderId">
						Order ID: {order._id && order._id.slice(20)}
					</h6>
					<div class="track">
						{order.status == 3 ? (
							<p>Đơn hàng này đã bị hủy!</p>
						) : (
							<>
								{" "}
								<div class={order.status >= 0 ? "active step" : "step"}>
									{" "}
									<span class="icon">
										{" "}
										<i class="fa fa-user"></i>{" "}
									</span>{" "}
									<span class="text">Xác nhận</span>{" "}
								</div>
								<div class={order.status >= 1 ? "active step" : "step"}>
									{" "}
									<span class="icon">
										{" "}
										<i class="fa fa-truck"></i>{" "}
									</span>{" "}
									<span class="text"> Đang giao hàng </span>{" "}
								</div>
								<div class={order.status >= 2 ? "active step" : "step"}>
									{" "}
									<span class="icon">
										{" "}
										<i class="fa fa-check"></i>{" "}
									</span>{" "}
									<span class="text">Hoàn Thành</span>{" "}
								</div>
							</>
						)}
					</div>
					<hr />

					<br />
					<button
						class="btn btn-warning"
						data-abc="true"
						onClick={handleCloseModal}
					>
						OK
					</button>
				</div>
			</article>
		</div>
	);

	return (
		<div class="bootdey">
			<div class="panel panel-default panel-order">
				<div class="panel-body">
					{props.listOrder &&
						props.listOrder.map((item) => (
							<div class="row" id={item._id}>
								<div class="col-md-1">
									<img
										src={item.products[0].book.images}
										class="media-object img-thumbnail"
									/>
								</div>
								<div class="col-md-11">
									<div class="row">
										<div class="col-md-12">
											<div class="pull-right">
												<label
													class={orderStatus[item.status].lableCss}
												>
													{orderStatus[item.status].content}
												</label>
											</div>
											<span>
												<strong>Order ID </strong>
											</span>{" "}
											<button
												class="label label-info button-detail-order"
												onClick={() => handleOpenModal(item)}
											>
												{item._id.slice(20)}
											</button>
											<br />
											Quantity : {item.products.length}, cost: $
											{item.totalrice} <br />
											{item.status == 0 ? (
												<button className="order-button">
													<DeleteIcon
														color="secondary"
														onClick={() =>
															handleClickOpen(item._id)
														}
													></DeleteIcon>
												</button>
											) : item.status == 3 ? (
												<ClearIcon
													style={{ fill: "red", fontSize: 20 }}
												></ClearIcon>
											) : (
												<CheckCircleOutlineIcon
													style={{ fill: "green", fontSize: 20 }}
												></CheckCircleOutlineIcon>
											)}
										</div>
										<div class="col-md-12">
											order made on:{" "}
											{new Date(
												Date.parse(item.createdAt)
											).toLocaleString()}
										</div>
									</div>
								</div>
							</div>
						))}
				</div>
				<div>
					<Dialog
						open={open}
						onClose={handleClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">
							{"Bạn có muốn hủy đơn hàng này ?"}
						</DialogTitle>

						<DialogActions>
							<Button onClick={handleClose} color="primary">
								Cancel
							</Button>
							<Button onClick={handleClick} color="primary" autoFocus>
								OK
							</Button>
						</DialogActions>
					</Dialog>
				</div>
				<Modal
					open={openModal}
					onClose={handleCloseModal}
					aria-labelledby="simple-modal-title"
					aria-describedby="simple-modal-description"
				>
					{body(orderItem)}
				</Modal>
			</div>
		</div>
	);
}

export default OrderList;
